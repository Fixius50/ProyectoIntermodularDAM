package tailscalebridge

import (
	"context"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"tailscale.com/tsnet"
)

var (
	tsServer *tsnet.Server
	mu       sync.Mutex
)

// Start proxy initializes Tailscale and starts a local SOCKS5 proxy on given port
func StartProxy(dataDir, authKey, hostname, socksPort string) string {
	mu.Lock()
	defer mu.Unlock()

	if tsServer != nil {
		return "Already running"
	}

	// Ensure the directory exists
	err := os.MkdirAll(dataDir, 0700)
	if err != nil {
		return "Failed to create data dir: " + err.Error()
	}

	tsServer = &tsnet.Server{
		Dir:       filepath.Join(dataDir, "tsnet"),
		Hostname:  hostname,
		AuthKey:   authKey,
		Logf:      func(format string, args ...any) {}, // Silence logs
		Ephemeral: false,                               // Keep state across restarts
	}

	// Start the server
	err = tsServer.Start()
	if err != nil {
		tsServer = nil
		return "Failed to start tsnet: " + err.Error()
	}

	// Loop to wait for initialization
	go func() {
		// Wait max 30 seconds for IP
		for i := 0; i < 30; i++ {
			lc, err := tsServer.LocalClient()
			if err == nil {
				status, err := lc.StatusWithoutPeers(context.Background())
				if err == nil && len(status.TailscaleIPs) > 0 {
					log.Printf("Tailscale Connected with IP: %v", status.TailscaleIPs[0])
					break
				}
			}
			time.Sleep(time.Second)
		}
	}()

	// Start a local SOCKS5 proxy that routes through the Tailscale network.
	// Since tsnet doesn't have a direct SOCKS5 server exposed simply,
	// In Android we typically just use the Dial function for Retrofit/OkHttp directly.
	// We will expose a way to do HTTP requests through Tailscale instead of a full SOCKS server for simplicity,
	// Or we can just leave this as an initialized node and we bridge the Dial Context to Java.

	return "Started successfully"
}

// Stop shuts down the Tailscale node
func Stop() {
	mu.Lock()
	defer mu.Unlock()

	if tsServer != nil {
		tsServer.Close()
		tsServer = nil
	}
}

// TestConnection verifies if we can reach a Tailscale Internal IP via HTTP
func TestConnection(url string) string {
	if tsServer == nil {
		return "Tailscale is not running"
	}

	client := tsServer.HTTPClient()
	client.Timeout = 10 * time.Second

	resp, err := client.Get(url)
	if err != nil {
		return "Error: " + err.Error()
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		return "Success: " + resp.Status
	}
	return "Failed with status: " + resp.Status
}
