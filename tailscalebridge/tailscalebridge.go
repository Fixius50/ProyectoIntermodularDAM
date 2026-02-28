package tailscalebridge

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/armon/go-socks5"
	"tailscale.com/tsnet"
)

var (
	tsServer *tsnet.Server
	mu       sync.Mutex
)

func init() {
	// Disable netlink monitoring as it fails on Android with permission denied.
	// This must be set before any tsnet.Server is initialized or started.
	os.Setenv("TS_NO_NETLINK", "true")
	os.Setenv("TS_DEBUG_NO_NETLINK", "true")
	os.Setenv("TS_NETSTACK_NETLINK", "0")
	os.Setenv("TS_SKIP_NETLINK_BIND", "true")

	log.Printf("TailscaleBridge: Netlink bypass initialized (Fase 5)")
}

// Start proxy initializes Tailscale and starts a local SOCKS5 proxy on given port
func StartProxy(dataDir, authKey, hostname, socksPort, tailscaleUser, tailscalePass string) string {
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
		AuthKey:   "tskey-auth-ksLaC6orfS11CNTRL-bbsStJGyQKfroV59uBd9Kf6kH9bRZzQpX",
		Logf:      log.Printf, // Enable logs for debugging
		Ephemeral: false,      // Keep state across restarts
	}

	// Disable netlink monitoring as it fails on Android with permission denied
	os.Setenv("TS_NO_NETLINK", "1")

	// Start the server
	err = tsServer.Start()
	if err != nil {
		tsServer = nil
		log.Printf("Failed to start tsnet: %v", err)
		return "Failed to start tsnet: " + err.Error()
	}

	// Create a SOCKS5 server that uses Tailscale as its dialer
	conf := &socks5.Config{
		Dial: func(ctx context.Context, network, addr string) (net.Conn, error) {
			return tsServer.Dial(ctx, network, addr)
		},
	}
	server, err := socks5.New(conf)
	if err != nil {
		return "Failed to create SOCKS5 server: " + err.Error()
	}

	// Start a local SOCKS5 proxy that routes through the Tailscale network.
	go func() {
		log.Printf("Tailscale Proxy: starting SOCKS5 server on localhost:%s", socksPort)
		// We listen on localhost only for security
		if err := server.ListenAndServe("tcp", "127.0.0.1:"+socksPort); err != nil {
			log.Printf("SOCKS5 server failed: %v", err)
		}
	}()

	// Wait max 30 seconds for IP and visibility
	go func() {
		for i := 0; i < 30; i++ {
			lc, err := tsServer.LocalClient()
			if err == nil {
				status, err := lc.StatusWithoutPeers(context.Background())
				if err == nil && len(status.TailscaleIPs) > 0 {
					log.Printf("Tailscale Connected! IP: %v", status.TailscaleIPs[0])
					break
				}
			}
			time.Sleep(time.Second)
		}
	}()

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
