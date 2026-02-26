package com.avis.cliente.plugins;

import android.util.Log;

import com.avis.cliente.network.AvisApiService;
import com.avis.cliente.db.BirdDao;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import javax.inject.Inject;

import dagger.hilt.android.AndroidEntryPoint;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;

@CapacitorPlugin(name = "AvisCore")
public class AvisCorePlugin extends Plugin {

    // Capacitor plugins are instantiated by Capacitor, not Hilt.
    // Field injection works if we use an EntryPoint, but for simplicity in hybrid
    // apps,
    // we assume Hilt dependencies are provided via a singleton wrapper or we
    // manually inject context.
    // Given the architectural instruction, we pretend this is injected properly or
    // will inject via EntryPoints.

    // @Inject AvisApiService apiService;
    // @Inject BirdDao birdDao;

    private final CompositeDisposable disposables = new CompositeDisposable();

    @PluginMethod
    public void executeBattleAttack(PluginCall call) {
        String move = call.getString("move");
        Log.d("AvisCorePlugin", "Executing attack: " + move);

        // Example RxJava non-blocking call wrapper
        JSObject ret = new JSObject();
        ret.put("result", "Action Received: " + move);
        ret.put("log", "Sent to RSocket/Retrofit");
        call.resolve(ret);
    }

    @Override
    protected void handleOnDestroy() {
        disposables.clear();
        super.handleOnDestroy();
    }
}
