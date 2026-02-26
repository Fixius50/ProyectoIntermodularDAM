package com.avis.cliente.plugins;

import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import tailscalebridge.Tailscalebridge;

/**
 * TailscalePlugin - Capacitor bridge to the Go/tsnet Tailscale library.
 *
 * Exposes three methods to the React frontend:
 *   - initTailscale(authKey, hostname) → starts the Tailscale node
 *   - stopTailscale()                  → shuts it down
 *   - testTailscaleConnection(url)     → HTTP health-check via Tailscale
 *
 * The Go library (tailscalebridge.aar) must be compiled with gomobile and
 * placed in android/app/libs/ before building the APK.
 */
@CapacitorPlugin(name = "TailscalePlugin")
public class TailscalePlugin extends Plugin {

    private static final String TAG = "TailscalePlugin";

    /**
     * Initialises the Tailscale node and connects it to the Tailnet.
     *
     * Expected JS call:
     *   await TailscalePlugin.initTailscale({ authKey: '...', hostname: 'aery-android' });
     *
     * @param call Capacitor plugin call containing 'authKey' and 'hostname'.
     */
    @PluginMethod
    public void initTailscale(PluginCall call) {
        String authKey  = call.getString("authKey", "");
        String hostname = call.getString("hostname", "aery-android");

        // Use the app's private data directory for tsnet state persistence.
        String dataDir = getContext().getFilesDir().getAbsolutePath() + "/tsnet";

        Log.d(TAG, "Initialising Tailscale node: hostname=" + hostname);

        // Run in a background thread — tsnet.Start() blocks until the socket is ready.
        new Thread(() -> {
            String result = Tailscalebridge.startProxy(dataDir, authKey, hostname, "1055");
            Log.d(TAG, "Tailscale StartProxy result: " + result);

            JSObject ret = new JSObject();
            ret.put("status", result);
            call.resolve(ret);
        }).start();
    }

    /**
     * Shuts down the Tailscale node cleanly.
     *
     * Expected JS call:
     *   await TailscalePlugin.stopTailscale();
     */
    @PluginMethod
    public void stopTailscale(PluginCall call) {
        Log.d(TAG, "Stopping Tailscale node.");
        Tailscalebridge.stop();
        call.resolve();
    }

    /**
     * Sends a test HTTP GET request through the active Tailscale connection.
     *
     * Expected JS call:
     *   const { result } = await TailscalePlugin.testTailscaleConnection({
     *     url: 'http://100.112.239.82:8080/api/health'
     *   });
     *
     * @param call Capacitor plugin call containing 'url'.
     */
    @PluginMethod
    public void testTailscaleConnection(PluginCall call) {
        String url = call.getString("url", "http://100.112.239.82:8080/api/health");

        new Thread(() -> {
            Log.d(TAG, "Testing Tailscale connection to: " + url);
            String result = Tailscalebridge.testConnection(url);
            Log.d(TAG, "Tailscale test result: " + result);

            JSObject ret = new JSObject();
            ret.put("result", result);
            call.resolve(ret);
        }).start();
    }
}
