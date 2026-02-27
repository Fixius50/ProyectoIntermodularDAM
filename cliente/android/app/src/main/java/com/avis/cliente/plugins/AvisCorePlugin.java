package com.avis.cliente.plugins;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.avis.cliente.db.BirdEntity;
import com.avis.cliente.db.InventoryEntity;
import com.avis.cliente.db.SightingEntity;
import com.avis.cliente.network.AvisApiService;
import com.avis.cliente.db.BirdDao;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import android.Manifest;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import dagger.hilt.EntryPoint;
import dagger.hilt.EntryPoints;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.UUID;

@CapacitorPlugin(
    name = "AvisCore",
    permissions = {
        @Permission(
            alias = "camera",
            strings = { Manifest.permission.CAMERA }
        ),
        @Permission(
            alias = "location",
            strings = { Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION }
        ),
        @Permission(
            alias = "microphone",
            strings = { Manifest.permission.RECORD_AUDIO }
        )
    }
)
public class AvisCorePlugin extends Plugin {

    private static final String TAG          = "AvisCorePlugin";
    private static final String PREFS_FILE   = "aery_secure_prefs";
    private static final String TOKEN_KEY    = "jwt_token";

    private final CompositeDisposable disposables = new CompositeDisposable();

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

    @PluginMethod
    public void ensurePermissions(PluginCall call) {
        if (!hasRequiredPermissions()) {
            requestAllPermissions(call, "checkPermissionsCallback");
        } else {
            JSObject ret = new JSObject();
            ret.put("status", "granted");
            call.resolve(ret);
        }
    }

    @PermissionCallback
    private void checkPermissionsCallback(PluginCall call) {
        if (hasRequiredPermissions()) {
            JSObject ret = new JSObject();
            ret.put("status", "granted");
            call.resolve(ret);
        } else {
            call.reject("Permisos no concedidos");
        }
    }

    private boolean hasRequiredPermissions() {
        return getPermissionState("camera") == PermissionState.GRANTED &&
               getPermissionState("location") == PermissionState.GRANTED &&
               getPermissionState("microphone") == PermissionState.GRANTED;
    }

    @PluginMethod
    public void executeBattleAttack(PluginCall call) {
        String move   = call.getString("move", "Cantar");
        String birdId = call.getString("birdId", "b1");

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
                        JSObject ret = new JSObject();
                        ret.put("result", "Ataque ejecutado (offline)");
                        ret.put("log",    "El ave usó " + move + " (local).");
                        ret.put("damage", 15);
                        call.resolve(ret);
                    }
                )
        );
    }

    @PluginMethod
    public void fetchInventory(PluginCall call) {
        disposables.add(
            getBirdDao().getAllInventory()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    items -> {
                        JSObject ret = new JSObject();
                        JSArray array = new JSArray();
                        for (InventoryEntity item : items) {
                            JSObject obj = new JSObject();
                            obj.put("id", item.id);
                            obj.put("name", item.name);
                            obj.put("icon", item.icon);
                            obj.put("count", item.count);
                            obj.put("description", item.description);
                            array.put(obj);
                        }
                        ret.put("items", array);
                        call.resolve(ret);
                    },
                    error -> call.reject("Failed to fetch inventory from Room")
                )
        );
    }

    @PluginMethod
    public void getPlayerBirds(PluginCall call) {
        disposables.add(
            getBirdDao().getAllBirds()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    birds -> {
                        JSObject ret = new JSObject();
                        JSArray array = new JSArray();
                        for (BirdEntity b : birds) {
                            JSObject obj = new JSObject();
                            obj.put("id", b.id);
                            obj.put("name", b.name);
                            obj.put("scientificName", b.scientificName);
                            obj.put("level", b.level);
                            obj.put("status", b.status);
                            obj.put("birdType", b.birdType);
                            obj.put("hp", b.hp);
                            obj.put("maxHp", b.maxHp);
                            obj.put("stamina", b.stamina);
                            obj.put("maxStamina", b.maxStamina);
                            obj.put("canto", b.canto);
                            obj.put("plumaje", b.plumaje);
                            obj.put("vuelo", b.vuelo);
                            obj.put("image", b.imageUrl);
                            array.put(obj);
                        }
                        ret.put("birds", array);
                        call.resolve(ret);
                    },
                    error -> call.reject("Failed to fetch birds from Room")
                )
        );
    }

    @PluginMethod
    public void saveSighting(PluginCall call) {
        String birdId = call.getString("birdId");
        Double lat = call.getDouble("lat");
        Double lon = call.getDouble("lon");
        String audioPath = call.getString("audioPath");
        String photoPath = call.getString("photoPath");
        String notes = call.getString("notes");

        SightingEntity sighting = new SightingEntity();
        sighting.id = UUID.randomUUID().toString();
        sighting.birdCardId = birdId;
        sighting.lat = lat != null ? lat : 0.0;
        sighting.lon = lon != null ? lon : 0.0;
        sighting.localAudioPath = audioPath;
        sighting.localPhotoPath = photoPath;
        sighting.notes = notes;
        sighting.sightedAt = System.currentTimeMillis();
        sighting.isSynced = false;

        disposables.add(
            getBirdDao().insertSighting(sighting)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    () -> {
                        JSObject ret = new JSObject();
                        ret.put("id", sighting.id);
                        call.resolve(ret);
                    },
                    error -> call.reject("Error al guardar avistamiento local")
                )
        );
    }

    @PluginMethod
    public void storeSecureToken(PluginCall call) {
        String token = call.getString("token", "");
        getContext().getSharedPreferences(PREFS_FILE, Context.MODE_PRIVATE)
            .edit().putString(TOKEN_KEY, token).apply();
        call.resolve();
    }

    @PluginMethod
    public void getSecureToken(PluginCall call) {
        String token = getContext().getSharedPreferences(PREFS_FILE, Context.MODE_PRIVATE)
            .getString(TOKEN_KEY, null);
        JSObject ret = new JSObject();
        ret.put("token", token);
        call.resolve(ret);
    }

    @PluginMethod
    public void saveBirds(PluginCall call) {
        JSArray birdsArray = call.getArray("birds");
        if (birdsArray == null) {
            call.reject("Must provide birds array");
            return;
        }

        java.util.List<BirdEntity> entities = new java.util.ArrayList<>();
        try {
            for (int i = 0; i < birdsArray.length(); i++) {
                JSObject obj = JSObject.fromJSONObject(birdsArray.getJSONObject(i));
                BirdEntity b = new BirdEntity();
                b.id = obj.getString("id");
                b.name = obj.getString("name");
                b.scientificName = obj.getString("scientificName");
                b.birdType = obj.getString("birdType");
                b.rarity = obj.getString("rarity");
                b.hp = obj.getInteger("hp", 0);
                b.maxHp = obj.getInteger("maxHp", 0);
                b.stamina = obj.getInteger("stamina", 0);
                b.maxStamina = obj.getInteger("maxStamina", 0);
                b.canto = obj.getInteger("canto", 0);
                b.plumaje = obj.getInteger("plumaje", 0);
                b.vuelo = obj.getInteger("vuelo", 0);
                b.level = obj.getInteger("level", 1);
                b.xp = obj.getInteger("xp", 0);
                b.maxXp = obj.getInteger("maxXp", 100);
                b.imageUrl = obj.getString("image");
                b.audioUrl = obj.getString("audioUrl");
                b.fact = obj.getString("fact");
                b.status = obj.getString("status");
                entities.add(b);
            }
        } catch (Exception e) {
            call.reject("JSON parsing error: " + e.getMessage());
            return;
        }

        disposables.add(
            getBirdDao().insertBirds(entities)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    () -> call.resolve(),
                    error -> call.reject("Error saving to Room: " + error.getMessage())
                )
        );
    }

    @PluginMethod
    public void saveInventory(PluginCall call) {
        JSArray itemsArray = call.getArray("items");
        if (itemsArray == null) {
            call.reject("Must provide items array");
            return;
        }

        java.util.List<InventoryEntity> entities = new java.util.ArrayList<>();
        try {
            for (int i = 0; i < itemsArray.length(); i++) {
                JSObject obj = JSObject.fromJSONObject(itemsArray.getJSONObject(i));
                InventoryEntity item = new InventoryEntity();
                item.id = obj.getString("id");
                item.name = obj.getString("name");
                item.icon = obj.getString("icon");
                item.count = obj.getInteger("count", 1);
                item.description = obj.getString("description");
                entities.add(item);
            }
        } catch (Exception e) {
            call.reject("JSON parsing error: " + e.getMessage());
            return;
        }

        disposables.add(
            getBirdDao().insertInventory(entities)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                    () -> call.resolve(),
                    error -> call.reject("Error saving to Room: " + error.getMessage())
                )
        );
    }

    @Override
    protected void handleOnDestroy() {
        disposables.clear();
        super.handleOnDestroy();
    }
}
