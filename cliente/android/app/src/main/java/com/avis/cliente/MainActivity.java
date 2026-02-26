package com.avis.cliente;

import com.avis.cliente.plugins.AvisCorePlugin;
import com.avis.cliente.plugins.TailscalePlugin;
import com.getcapacitor.BridgeActivity;

/**
 * MainActivity - Entry point for the Capacitor hybrid Android app.
 *
 * NOTE: We do NOT use @AndroidEntryPoint here because BridgeActivity (Capacitor)
 * is not a Hilt-aware base class. Instead, the plugins use the @EntryPoint
 * pattern (EntryPoints.get()) to access Hilt-provided dependencies.
 *
 * Plugins registered:
 *   - AvisCorePlugin  → game data (inventory, birds, battle, auth token)
 *   - TailscalePlugin → Tailscale VPN connectivity (Go/tsnet bridge)
 */
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
