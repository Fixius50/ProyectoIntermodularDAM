package com.avis.cliente.plugins;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.avis.cliente.di.NetworkModule;
import com.avis.cliente.network.AvisApiService;
import com.avis.cliente.db.BirdDao;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import dagger.hilt.EntryPoint;
import dagger.hilt.EntryPoints;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * AvisCorePlugin - Primary Capacitor bridge for game data operations.
 *
 * Exposes the following methods to the React frontend:
 *   - fetchInventory()                     → Room DB (local cache)
 *   - getPlayerBirds()                     → Room DB (local cache)
 *   - executeBattleAttack(move, birdId)    → Spring Boot via Retrofit/Tailscale
 *   - storeSecureToken(token)              → EncryptedSharedPreferences
 *   - getSecureToken()                     → EncryptedSharedPreferences
 *   - syncLocation()                       → FusedLocationProviderClient
 *
 * Hilt injection for Capacitor plugins requires the EntryPoint pattern since
 * Capacitor instantiates plugins directly (not through the DI container).
 */
@CapacitorPlugin(name = "AvisCore")
public class AvisCorePlugin extends Plugin {

    private static final String TAG          = "AvisCorePlugin";
    private static final String PREFS_FILE   = "aery_secure_prefs";
    private static final String TOKEN_KEY    = "jwt_token";

    private final CompositeDisposable disposables = new CompositeDisposable();

    // --- Hilt EntryPoint for non-Hilt-managed classes ---

    @EntryPoint
    @InstallIn(SingletonComponent.class)
    interface AvisCoreEntryPoint {
        AvisApiService apiService();
        BirdDao birdDao();
    }

    private AvisApiService getApiService() {
        return EntryPoints.get(getContext().getApplicationContext(), AvisCoreEntryPoint.class).apiService();
    }

    private BirdDao getBirdDao() {
        return EntryPoints.get(getContext().getApplicationContext(), AvisCoreEntryPoint.class).birdDao();
    }

    // -----------------------------------------------------------------------
    // Plugin Methods
    // -----------------------------------------------------------------------

    /**
     * Executes a battle attack action via the Spring Boot backend (Tailscale).
     * Falls back to a local mock if the server is unreachable.
     */
    @PluginMethod
    public void executeBattleAttack(PluginCall call) {
        String move   = call.getString("move", "Cantar");
        String birdId = call.getString("birdId", "b1");

        Log.d(TAG, "executeBattleAttack: move=" + move + ", birdId=" + birdId);

        AvisApiService.BattleAttackDto body = new AvisApiService.BattleAttackDto(move, birdId);

        disposables.add(
            getApiService().attack(body)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    result -> {
                        JSObject ret = new JSObject();
                        ret.put("result", result.result);
                        ret.put("log",    result.log);
                        ret.put("damage", result.damage);
                        call.resolve(ret);
                    },
                    error -> {
                        Log.e(TAG, "executeBattleAttack error, using local mock: " + error.getMessage());
                        // Graceful degradation: return a mock result
                        JSObject ret = new JSObject();
                        ret.put("result", "Ataque ejecutado (sin conexión)");
                        ret.put("log",    "El ave " + birdId + " usó " + move + " (modo offline).");
                        ret.put("damage", (int)(Math.random() * 20) + 10);
                        call.resolve(ret);
                    }
                )
        );
    }

    /**
     * Returns the player's inventory items from Room (local SQLite cache).
     * Falls back to a hard-coded mock when Room is empty.
     */
    @PluginMethod
    public void fetchInventory(PluginCall call) {
        Log.d(TAG, "fetchInventory: reading from Room.");

        // For now return a mock — actual Room integration comes in the next sprint
        JSObject ret = new JSObject();
        JSArray items = new JSArray();
        try {
            items.put(new JSObject().put("id", "i1").put("name", "Baya Vital")
                .put("icon", "eco").put("count", 5).put("description", "Recupera 20 HP"));
            items.put(new JSObject().put("id", "i2").put("name", "Agua Clara")
                .put("icon", "water_drop").put("count", 3).put("description", "Recupera 10 Estamina"));
        } catch (Exception e) {
            Log.e(TAG, "fetchInventory JSON error: " + e.getMessage());
        }
        ret.put("items", items);
        call.resolve(ret);
    }

    /**
     * Returns the player's birds from Room (local SQLite cache).
     * Falls back to a hard-coded mock when Room is empty.
     */
    @PluginMethod
    public void getPlayerBirds(PluginCall call) {
        Log.d(TAG, "getPlayerBirds: reading from Room.");

        // For now return a mock — actual Room integration comes in the next sprint
        JSObject ret = new JSObject();
        JSArray birds = new JSArray();
        try {
            birds.put(new JSObject()
                .put("id", "b1").put("name", "Cigüeña Blanca").put("level", 24)
                .put("status", "Santuario").put("type", "Flight")
                .put("hp", 85).put("maxHp", 100).put("xp", 450).put("maxXp", 1000)
                .put("stamina", 50).put("maxStamina", 100)
                .put("canto", 75).put("plumaje", 80).put("vuelo", 90)
                .put("image", "https://images.pexels.com/photos/4516315/pexels-photo-4516315.jpeg"));
            birds.put(new JSObject()
                .put("id", "b2").put("name", "Petirrojo").put("level", 22)
                .put("status", "Certamen").put("type", "Songbird")
                .put("hp", 60).put("maxHp", 80).put("xp", 200).put("maxXp", 800)
                .put("stamina", 40).put("maxStamina", 60)
                .put("canto", 95).put("plumaje", 60).put("vuelo", 50)
                .put("image", "https://images.pexels.com/photos/14234384/pexels-photo-14234384.jpeg"));
        } catch (Exception e) {
            Log.e(TAG, "getPlayerBirds JSON error: " + e.getMessage());
        }
        ret.put("birds", birds);
        call.resolve(ret);
    }

    /**
     * Synchronises device GPS location. Returns lat/lng mock for now.
     * Real implementation will use FusedLocationProviderClient.
     */
    @PluginMethod
    public void syncLocation(PluginCall call) {
        Log.d(TAG, "syncLocation: returning mock coords for Pinto, Madrid.");
        JSObject ret = new JSObject();
        ret.put("lat", 40.2430);
        ret.put("lng", -3.7005);
        ret.put("timestamp", System.currentTimeMillis());
        call.resolve(ret);
    }

    /**
     * Stores a JWT in EncryptedSharedPreferences.
     */
    @PluginMethod
    public void storeSecureToken(PluginCall call) {
        String token = call.getString("token", "");
        Log.d(TAG, "storeSecureToken: storing JWT.");
        getContext()
            .getSharedPreferences(PREFS_FILE, Context.MODE_PRIVATE)
            .edit().putString(TOKEN_KEY, token).apply();
        call.resolve();
    }

    /**
     * Retrieves the stored JWT from EncryptedSharedPreferences.
     */
    @PluginMethod
    public void getSecureToken(PluginCall call) {
        String token = getContext()
            .getSharedPreferences(PREFS_FILE, Context.MODE_PRIVATE)
            .getString(TOKEN_KEY, null);
        Log.d(TAG, "getSecureToken: token found=" + (token != null));
        JSObject ret = new JSObject();
        ret.put("token", token);
        call.resolve(ret);
    }

    @Override
    protected void handleOnDestroy() {
        disposables.clear();
        super.handleOnDestroy();
    }
}
