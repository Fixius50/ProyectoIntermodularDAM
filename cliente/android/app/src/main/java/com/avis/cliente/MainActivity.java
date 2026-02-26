package com.avis.cliente;

import com.avis.cliente.plugins.AvisCorePlugin;
import com.avis.cliente.plugins.TailscalePlugin;
import com.getcapacitor.BridgeActivity;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * MainActivity - Entry point for the Capacitor hybrid Android app.
 *
 * Registers all custom Capacitor plugins so they are available to the
 * React/TypeScript frontend via the Capacitor bridge.
 *
 * Plugins registered:
 *   - AvisCorePlugin  → game data (inventory, birds, battle, auth token)
 *   - TailscalePlugin → Tailscale VPN connectivity (Go/tsnet bridge)
 */
@AndroidEntryPoint
public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        // Register custom plugins BEFORE super.onCreate() so Capacitor
        // can discover them during bridge initialisation.
        registerPlugin(AvisCorePlugin.class);
        registerPlugin(TailscalePlugin.class);

        super.onCreate(savedInstanceState);
    }
}
