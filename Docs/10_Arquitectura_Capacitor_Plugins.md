# 10 Arquitectura de Plugins en Capacitor

El puente entre el ecosistema Frontend React/TypeScript y el ecosistema Native Java Android se realiza a través de **Plugins Propios de Capacitor**.  
Dado que el requerimiento estricto (Reglas Maestras y ARQUITECTURA_CLIENTE) es manejar la red (Retrofit, OkHttp), base de datos (Room) y ubicación (FusedLocation) con Java Nativo puro de Android, el Frontend PWA nunca hará estas llamadas directamente (ej. nunca usará `fetch()` ni la Geolocation API web).

## El Puente Híbrido

### 1. El Frontend PWA
El código TypeScript en React simplemente invoca a un método asíncrono proporcionado por un plugin Capacitor, enviando y recibiendo JSON.  
*Ejemplo (TypeScript):*
```typescript
import { registerPlugin } from '@capacitor/core';

export interface AvisCorePlugin {
  executeBattleAttack(options: { move: string }): Promise<{ result: string, log: string }>;
  fetchInventory(): Promise<{ birds: any[] }>;
  syncLocation(): Promise<{ lat: number, lng: number }>;
}

const AvisCore = registerPlugin<AvisCorePlugin>('AvisCore');

// Uso en React:
const { result } = await AvisCore.executeBattleAttack({ move: 'SING' });
```

### 2. El Backend Android (Java)
El plugin se implementa como una clase de Java extendiendo `Plugin` y decorada con `@CapacitorPlugin`. Dentro de estos métodos Java inyectamos nuestras dependencias maestras mediante Dagger/Hilt.
*Ejemplo (Java):*
```java
@CapacitorPlugin(name = "AvisCore")
public class AvisCorePlugin extends Plugin {

    @Inject Retrofit retrofit;
    @Inject FusedLocationProviderClient locationProvider;

    @PluginMethod
    public void executeBattleAttack(PluginCall call) {
        String move = call.getString("move");
        // ... se delega al ViewModel o Repositorio en RxJava/Retrofit ...
        
        // Retornar resultado a React
        JSObject ret = new JSObject();
        ret.put("result", "Victory");
        call.resolve(ret);
    }
}
```

## Estándares de Concurrencia
Para cumplir la arquitectura reactiva, los métodos `PluginMethod` **no deben bloquear el hilo principal**. Deben:
1. Recibir la llamada (el `PluginCall`).
2. Despachar el trabajo al hilo correspondiente en RxJava (`Schedulers.io()`).
3. En el `.subscribe()`, una vez que se obtengan los datos de Retrofit o Room, volver a postear el resultado mediante `call.resolve()` en el hilo principal o simplemente mandándolo tal cual si Capacitor lo maneja internamente de forma Thread-Safe.
