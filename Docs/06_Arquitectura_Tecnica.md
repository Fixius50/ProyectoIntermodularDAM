# 06 Arquitectura Técnica Completa — AVIS

Referencia unificada de Stack de Tecnologías, Backend (Spring Boot), Frontend (React/Capacitor) y capa nativa Android (Java/Hilt/Retrofit).

---

## 🧩 0. Stack Tecnológico (Visión General)

### Backend (Reactivo y No Bloqueante)
- **Framework Core:** Java 21 + Spring Boot 3 (WebFlux)
- **Tiempo Real:** RSocket (puerto 7000) + WebSockets STOMP
- **Persistencia:** Supabase (PostgreSQL) + Spring Data R2DBC (asíncrono)
- **Caché:** Spring Data Redis Reactive + Redisson (Distributed Locks)
- **Identidad:** Spring Security Reactive + JWT (HS512)
- **Eventos:** RabbitMQ / Kafka

### Frontend (Híbrido Web + Android)
- **Framework Core:** React 18 + Vite + TypeScript
- **Target Mobile:** Capacitor 6 → APK Android nativo (WebView)
- **Estado Global:** Zustand (persist `localStorage` → key `aery-storage`)
- **Estilos:** Tailwind CSS + CSS Variables (Glassmorphism)
- **Router:** `currentScreen` en Zustand (SPA, sin React Router)
- **Android Nativo:** Java + Hilt + Retrofit + RxJava3 + Room + OkHttp

### Conectividad Cliente ↔ Servidor (Tailscale VPN)
- Servidor Spring Boot en Lubuntu: `100.112.239.82:8080`
- Cliente Android conecta vía **Tailscale VPN embebida** (Go/tsnet compilado como `.aar`)
- `TailscalePlugin.java` (Capacitor) arranca la VPN antes de cualquier llamada Retrofit
- Compilación del bridge: `tailscalebridge/build_aar.ps1`

### APIs Externas

| API | Uso |
|---|---|
| **Nuthatch API** | Datos taxonómicos (nombre científico, familia, audio del canto) |
| **wttr.in** | Clima en tiempo real (sin API key) para `weather.ts` |
| **Pexels API** | Imágenes de aves y hábitats |
| **DiceBear API** | Avatares de usuario generados dinámicamente |

### Entorno de Desarrollo

| Entorno | Herramientas |
|---|---|
| **Servidor remoto (Lubuntu)** | Java 21, Maven, Docker (Redis + RabbitMQ) |
| **Cliente (Windows)** | Node.js, npm, Android Studio, Go, gomobile |
| **Acceso remoto** | `ssh lubuntu@100.112.239.82` (vía Tailscale) |
| **Scripts de Build** | `tailscalebridge/build_aar.ps1` (compile + copy .aar) |

---

## 🏗️ A. Backend (Java 21 + Spring Boot 3 + WebFlux)

### Política de Infraestructura
- **Persistencia:** Relacional pura (R2DBC + PostgreSQL/Supabase). Prohibido JSONB.
- **Red:** Tailscale VPN. El servidor escucha en `0.0.0.0` en:
  - Puerto `8080` — API REST (WebFlux)
  - Puerto `7000` — Tiempo real (RSocket)

---

### A.1 Filosofía Non-Blocking (Spring WebFlux)

Spring WebFlux usa el servidor **Netty** con un modelo de Event Loop. Un único hilo atiende cientos de peticiones sin bloquearse: lanza la tarea a la BD y se va a atender otros clientes. Cuando la BD responde, retoma al usuario.

- `Mono<T>` — responde con 0 o 1 elemento (ej. un perfil de jugador)
- `Flux<T>` — responde con N elementos (ej. lista de aves del catálogo)

### A.2 Módulo de Catálogo (WebClient)

`BirdCatalogService` usa `WebClient` (HTTP reactivo) para consultar APIs externas (Nuthatch) on-demand. No almacena el catálogo internamente; lo deserializa con Jackson a `Flux<BirdRecord>`.

### A.3 Módulo Colección / Taller (R2DBC)

Persistencia asíncrona con R2DBC. Operación de Crafting es atómica:
1. Consume materiales del inventario
2. Llama a la lógica de probabilidad (clima + estructura + cebo)
3. Inserta la nueva `BirdCard` con `save()`

### A.4 Módulo Certamen (RSocket — Puerto 7000)

**Flujo de matchmaking:**
1. `battle.room.create` → Host envía su ID + ID de carta → servidor genera `sessionId`, estado `WAITING`
2. `battle.room.join` → Segundo jugador envía `sessionId` → estado `IN_PROGRESS`
3. `battle.action.stream` → Canal bidireccional; cada ataque descuenta HP instantáneamente
4. Finalización → `FINISHED`, recompensas despachadas vía **RabbitMQ**

**RSocket vs REST:**
- REST = enviar cartas por buzón (lento, síncrono)
- RSocket = llamada telefónica abierta todo el día (instantáneo, bidireccional, con _Backpressure_)

### A.5 Módulo Marketplace (Redis + Redisson)

`MarketplaceService` usa `ConcurrentHashMap` en RAM + bloques `synchronized` para el anti-doble-gasto. En producción: **Redis** para búsquedas sub-milisegundo + **Redisson** para locks distribuidos (dos usuarios no pueden comprar la misma carta simultáneamente).

### A.6 Módulo de Eventos (RabbitMQ)

Las recompensas post-combate se encolan con AMQP para no bloquear el cierre del duelo. `RewardConsumerService` (`@RabbitListener`) las procesa en segundo plano.

### A.7 Seguridad (Spring Security Reactive + JWT)

Todo request pasa por `WebFilterChain` antes de llegar al controller. El `JwtUtil` decodifica `Authorization: Bearer <token>` con HS512. Si falla → `401 UNAUTHORIZED` sin despertar Spring. Stateless, resistente a DDoS básico.

---

## 🖥️ B. Frontend (React 18 + Vite + TypeScript + Capacitor)

### B.1 Arquitectura SPA

Single Page Application: la shell completa se descarga una sola vez. Toda navegación ocurre en memoria del dispositivo. Solo salen peticiones para datos de API.

**Virtual DOM (Reconciliation):**
- React mantiene una "fotocopia matemática" del DOM en RAM
- Solo repinta los píxeles que cambiaron (ej. si ganas 50 Semillas, solo se repinta ese número)
- Resultado: 60 FPS sin consumo excesivo de batería

### B.2 Gestión de Estado (Zustand)

```typescript
// store/useAppStore.ts
const useAppStore = create(persist(
    (set, get) => ({
        currentUser: null,
        playerBirds: [],
        inventory: [],
        weather: 'sunny',
        notifications: [],
        // Acciones:
        login: (user) => set({ currentUser: user }),
        syncInventory: async () => { /* llama a AvisCore.fetchInventory() */ },
        executeAttack: async (move, birdId) => { /* llama a AvisCore.executeBattleAttack() */ },
    }),
    { name: 'aery-storage', partialize: (s) => ({ currentUser: s.currentUser, playerBirds: s.playerBirds }) }
))
```

### B.3 Seguridad JWT (Interceptor)

El token JWT se guarda vía `AvisCore.storeSecureToken()` (EncryptedSharedPreferences en Android, no localStorage). El interceptor de OkHttp añade `Authorization: Bearer <token>` a cada petición Retrofit automáticamente.

### B.4 Módulo de Certamen (RSocket-js / Hook Custom)

```typescript
// Hook useBattleSocket() — canal bidireccional con el servidor
const { attack, opponentState } = useBattleSocket(sessionId);
// Cuando el servidor empuja un evento, React actualiza la barra de HP
// y dispara la animación de daño instantáneamente
```

### B.5 Optimistic UI (Crafting & Marketplace)

React aplica el cambio visualmente antes de que el servidor responda:
1. Resta semillas en pantalla e inyecta la carta temporalmente
2. Envía `POST` asíncrono a Spring Boot
3. Si el servidor devuelve `400` (doble-gasto / recursos insuficientes) → `.catch()` revierte el estado y muestra notificación

### B.6 Estructura de Directorios

```text
Cliente/src/
├── components/       → Navbar, BottomNav, GlassPanel, BirdCard
├── data/             → birds.ts (catálogo local — 6 aves de Pinto)
├── screens/
│   ├── auth/         → Login.tsx
│   ├── home/         → ElSantuario.tsx
│   ├── expedition/   → LaExpedicion.tsx
│   └── arena/        → ElCertamen.tsx
├── services/
│   ├── avisCore.ts   → AvisCore + TailscalePlugin (Capacitor bridge)
│   ├── weather.ts    → wttr.in (sin API key)
│   └── time.ts       → fase del día
├── store/
│   └── useAppStore.ts → Zustand (persist localStorage)
└── types/index.ts    → Bird, User, AppState, InventoryItem...
```

---

## 📱 C. Capa Nativa Android (Java + Hilt + Retrofit)

### C.1 Dependencias Gradle (app/build.gradle)

```gradle
// Inyección de dependencias
implementation 'com.google.dagger:hilt-android:2.51.1'
annotationProcessor 'com.google.dagger:hilt-compiler:2.51.1'

// Red
implementation 'com.squareup.retrofit2:retrofit:2.11.0'
implementation 'com.squareup.retrofit2:converter-gson:2.11.0'
implementation 'com.squareup.retrofit2:adapter-rxjava3:2.11.0'
implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'

// Concurrencia
implementation 'io.reactivex.rxjava3:rxjava:3.1.8'
implementation 'io.reactivex.rxjava3:rxandroid:3.0.2'

// Persistencia local
implementation 'androidx.room:room-runtime:2.6.1'
implementation 'androidx.room:room-rxjava3:2.6.1'
annotationProcessor 'androidx.room:room-compiler:2.6.1'

// Seguridad
implementation 'androidx.security:security-crypto:1.1.0-alpha06'

// Tailscale Bridge (Go/tsnet compilado con gomobile)
implementation(name: 'tailscalebridge', ext: 'aar')
```

### C.2 Módulos Hilt

| Módulo | Provee |
|---|---|
| `NetworkModule.java` | `OkHttpClient`, `Retrofit`, `AvisApiService` — BASE_URL: `http://100.112.239.82:8080/` |
| `DatabaseModule.java` | `AppDatabase` (Room), `BirdDao` |

### C.3 Plugins Capacitor

Ver `07_Arquitectura_Capacitor_Plugins.md` para la documentación completa. Resumen:

| Plugin | Responsabilidad |
|---|---|
| `AvisCorePlugin` | Datos del juego: inventario, aves, batalla, token JWT |
| `TailscalePlugin` | Conectividad VPN Tailscale (Go/tsnet `.aar`) |

**Patrón obligatorio para plugins** (no inyectables por Hilt directamente):
```java
@EntryPoint
@InstallIn(SingletonComponent.class)
interface MyEntryPoint { AvisApiService apiService(); }

// Dentro del plugin:
AvisApiService svc = EntryPoints.get(getContext().getApplicationContext(), MyEntryPoint.class).apiService();
```

### C.4 Compilar tailscalebridge.aar

```powershell
# ONE-TIME: añadir x/mobile al go.mod del bridge
cd tailscalebridge/
go get golang.org/x/mobile@latest

# Compilar (NDK 25.0.8775105 requerido)
powershell -ExecutionPolicy Bypass -File .\build_aar.ps1
```

Resultado: `tailscalebridge.aar` (~60 MB, arm + arm64 + x86 + x86_64) copiado automáticamente a `Cliente/android/app/libs/`.

Ver `Docs/Skills/Skill_Build_Tailscale_AAR.md` para troubleshooting detallado.

---

## 🔄 D. Flujo Completo de Datos

```
[React Component]
     ↓  await AvisCore.executeBattleAttack({ move, birdId })
[Capacitor Bridge]
     ↓  call Java via WebView JSI
[AvisCorePlugin.java (EntryPoint)]
     ↓  getApiService().attack(dto)  [RxJava3 / Schedulers.io()]
[Retrofit → OkHttp → Tailscale VPN]
     ↓  HTTP POST http://100.112.239.82:8080/api/battle/attack
[Spring Boot BattleController]
     ↓  BattleService.processAttack() → returns BattleResult
[Retrofit → call.resolve(JSObject)]
     ↓
[React state update → UI repaint]
```
