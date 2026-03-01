package tailscalebridge

import (
	"io"
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

func init() {
	// Desactivar netlink para Android (permisos)
	os.Setenv("TS_NO_NETLINK", "true")
	os.Setenv("TS_DEBUG_NO_NETLINK", "true")
	os.Setenv("TS_NETSTACK_NETLINK", "0")
	os.Setenv("TS_SKIP_NETLINK_BIND", "true")
}

// StartProxy inicia Tailscale y levanta un Proxy Inverso HTTP en el puerto indicado.
func StartProxy(dataDir, authKey, hostname, proxyPort, tailscaleUser, tailscalePass string) string {
	mu.Lock()
	defer mu.Unlock()

	if tsServer != nil {
		return "Already running"
	}

	err := os.MkdirAll(dataDir, 0700)
	if err != nil {
		return "Failed to create data dir: " + err.Error()
	}

	tsServer = &tsnet.Server{
		Dir:       filepath.Join(dataDir, "tsnet"),
		Hostname:  hostname,
		AuthKey:   authKey,
		Logf:      log.Printf,
		Ephemeral: true,
	}

	err = tsServer.Start()
	if err != nil {
		tsServer = nil
		return "Failed to start tsnet: " + err.Error()
	}

	// Servidor de Proxy Inverso
	go func() {
		log.Printf("Tailscale Proxy: Iniciando Reverse Proxy en 127.0.0.1:%s", proxyPort)

		tsClient := tsServer.HTTPClient()

		mux := http.NewServeMux()
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			targetURL := "http://100.112.94.34:8080" + r.URL.Path
			if r.URL.RawQuery != "" {
				targetURL += "?" + r.URL.RawQuery
			}

			req, err := http.NewRequest(r.Method, targetURL, r.Body)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			for k, v := range r.Header {
				for _, vv := range v {
					req.Header.Add(k, vv)
				}
			}

			resp, err := tsClient.Do(req)
			if err != nil {
				http.Error(w, "Backend unreachable via Tailscale: "+err.Error(), http.StatusBadGateway)
				return
			}
			defer resp.Body.Close()

			for k, v := range resp.Header {
				for _, vv := range v {
					w.Header().Add(k, vv)
				}
			}
			w.WriteHeader(resp.StatusCode)
			io.Copy(w, resp.Body)
		})

		server := &http.Server{
			Addr:    "127.0.0.1:" + proxyPort,
			Handler: mux,
		}

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("Proxy server failed: %v", err)
		}
	}()

	return "Proxy started successfully"
}

// StopProxy detiene el nodo Tailscale de forma segura.
func StopProxy() {
	mu.Lock()
	defer mu.Unlock()
	if tsServer != nil {
		tsServer.Close()
		tsServer = nil
	}
}

// TestConnection realiza una prueba de conexión HTTP a través de Tailscale.
func TestConnection(targetUrl string) string {
	if tsServer == nil {
		return "Tailscale is not running"
	}
	client := tsServer.HTTPClient()
	client.Timeout = 10 * time.Second
	resp, err := client.Get(targetUrl)
	if err != nil {
		return "Error: " + err.Error()
	}
	defer resp.Body.Close()
	return "Success: " + resp.Status
}
