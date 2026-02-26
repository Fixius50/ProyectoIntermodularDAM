# 10 Arquitectura de Plugins en Capacitor (AVIS)

El puente entre el ecosistema Frontend **React/TypeScript** y el ecosistema **Nativo Java Android** se realiza a través de **Plugins Propios de Capacitor**.

El frontend nunca usa `fetch()` ni la Geolocation API web. Todo el I/O pasa por los plugins.

---

## Plugins Registrados (26/02/2026)

| Plugin Name         | Clase Java                    | Responsabilidad |
|---------------------|-------------------------------|-----------------|
| `AvisCore`          | `AvisCorePlugin.java`         | Datos del juego: inventario, aves, batalla, tokens JWT |
| `TailscalePlugin`   | `TailscalePlugin.java`        | Conectividad VPN Tailscale (Go/tsnet `.aar`) |

Ambos se registran en `MainActivity.java` antes de `super.onCreate()`:
```java
registerPlugin(AvisCorePlugin.class);
registerPlugin(TailscalePlugin.class);
```

---

## 1. Frontend TypeScript — Uso

```typescript
// src/services/avisCore.ts
import { registerPlugin } from '@capacitor/core';

// Plugin de datos del juego
const AvisCore = registerPlugin<AvisCorePlugin>('AvisCore', { web: avisCoreWebMock });

// Plugin de conectividad VPN
export const TailscalePlugin = registerPlugin<TailscalePluginInterface>(
    'TailscalePlugin',
    { web: tailscaleWebMock }
);

// Uso en React — inicializar Tailscale al arrancar la app
const { status } = await TailscalePlugin.initTailscale({
    authKey: 'tskey-...',
    hostname: 'aery-android'
});

// Luego, llamadas de datos van a través de la VPN activa
const { birds } = await AvisCore.getPlayerBirds();
const { items } = await AvisCore.fetchInventory();
const { result } = await AvisCore.executeBattleAttack({ move: 'Cantar', birdId: 'b1' });
```

### Interfaz completa `AvisCorePlugin`
```typescript
interface AvisCorePlugin {
    executeBattleAttack(opts: { move: string; birdId: string }): Promise<{ result: string; log: string; damage: number }>;
    fetchInventory(): Promise<{ items: InventoryItem[] }>;
    syncLocation(): Promise<{ lat: number; lng: number; timestamp: number }>;
    getPlayerBirds(): Promise<{ birds: Bird[] }>;
    storeSecureToken(opts: { token: string }): Promise<void>;
    getSecureToken(): Promise<{ token: string | null }>;
}
```

### Interfaz completa `TailscalePluginInterface`
```typescript
interface TailscalePluginInterface {
    initTailscale(opts: { authKey: string; hostname: string }): Promise<{ status: string }>;
    stopTailscale(): Promise<void>;
    testTailscaleConnection(opts: { url: string }): Promise<{ result: string }>;
}
```

---

## 2. Backend Android Java — AvisCorePlugin

Usa el patrón **Hilt EntryPoint** (requerido para plugins Capacitor, que son instanciados por Capacitor, no por Hilt):

```java
@CapacitorPlugin(name = "AvisCore")
public class AvisCorePlugin extends Plugin {

    @EntryPoint
    @InstallIn(SingletonComponent.class)
    interface AvisCoreEntryPoint {
        AvisApiService apiService();
        BirdDao birdDao();
    }

    private AvisApiService getApiService() {
        return EntryPoints.get(
            getContext().getApplicationContext(),
            AvisCoreEntryPoint.class
        ).apiService();
    }

    @PluginMethod
    public void executeBattleAttack(PluginCall call) {
        String move   = call.getString("move", "Cantar");
        String birdId = call.getString("birdId", "b1");

        disposables.add(
            getApiService().attack(new BattleAttackDto(move, birdId))
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
                        // Degradación elegante: mock offline
                        JSObject ret = new JSObject();
                        ret.put("result", "Ataque (offline)");
                        ret.put("log",    move + " → " + birdId);
                        ret.put("damage", (int)(Math.random()*20)+10);
                        call.resolve(ret);
                    }
                )
        );
    }
}
```

---

## 3. Backend Android Java — TailscalePlugin

Llama directamente a la librería Go compilada (`.aar`):

```java
@CapacitorPlugin(name = "TailscalePlugin")
public class TailscalePlugin extends Plugin {

    @PluginMethod
    public void initTailscale(PluginCall call) {
        String authKey  = call.getString("authKey", "");
        String hostname = call.getString("hostname", "aery-android");
        String dataDir  = getContext().getFilesDir().getAbsolutePath() + "/tsnet";

        // Ejecutar en background — tsnet.Start() es bloqueante
        new Thread(() -> {
            String result = Tailscalebridge.startProxy(dataDir, authKey, hostname, "1055");
            JSObject ret = new JSObject();
            ret.put("status", result);
            call.resolve(ret);
        }).start();
    }

    @PluginMethod
    public void testTailscaleConnection(PluginCall call) {
        String url = call.getString("url", "http://100.112.239.82:8080/api/health");
        new Thread(() -> {
            String result = Tailscalebridge.testConnection(url);
            JSObject ret = new JSObject();
            ret.put("result", result);
            call.resolve(ret);
        }).start();
    }
}
```

---

## 4. Estándares de Concurrencia

Los `@PluginMethod` **nunca bloquean el hilo principal**:
1. Reciben el `PluginCall`.
2. Despachan trabajo a `Schedulers.io()` (RxJava3) o a un `new Thread()`.
3. En el `.subscribe()` o completación, llaman `call.resolve(ret)`.

---

## 5. Flujo Completo de Conexión

```
[React] await TailscalePlugin.initTailscale(...)
    ↓
[TailscalePlugin.java] → Tailscalebridge.startProxy(...) ← Go/tsnet (.aar)
    ↓
[tsnet.Server] — establece túnel VPN con el Tailnet
    ↓
[Retrofit + OkHttp] → http://100.112.239.82:8080/api/...
    ↓
[Spring Boot Server — Lubuntu]
```
