# 06 Arquitectura Técnica Completa — AVIS

> **Actualizado:** 2026-02-27. Refleja fielmente el estado actual del código.

---

## 0. Visión General del Sistema

AVIS es una aplicación móvil híbrida de ornitología y estrategia. La arquitectura combina:

| Capa | Tecnología | Rol |
|---|---|---|
| **Frontend Web** | React 18 + Vite + TypeScript | UI renderizada en WebView |
| **Capa Nativa Android** | Capacitor 6 + Java + Hilt | Bridge JS ↔ Android, plugins nativos |
| **Conectividad VPN** | Tailscale (Go/tsnet → `.aar`) | Túnel seguro (IP: `100.112.94.34`) |
| **Backend** | Spring Boot 4 + WebFlux (Java 22) | API en `http://100.112.94.34:8080/` |
| **Persistencia** | Supabase (PostgreSQL) + R2DBC | BD reactiva no bloqueante |
| **Caché / Locks** | Redis + Redisson | Marketplace, anti-doble-gasto |
| **Mensajería** | RabbitMQ | Recompensas post-combate asíncronas |

---

## 1. Flujo Completo de una Petición

```
┌──────────────────────────────────────────────┐
│               DISPOSITIVO ANDROID             │
│                                               │
│  React 18 + Vite (WebView)                    │
│  ┌──────────────────────────────────────┐     │
│  │  Component → Zustand Store           │     │
│  │   await AvisCore.executeBattleAttack()│     │
│  └─────────────┬────────────────────────┘     │
│                │  Capacitor JSI Bridge         │
│  ┌─────────────▼────────────────────────┐     │
│  │  AvisCorePlugin.java  (EntryPoint)   │     │
│  │  TailscalePlugin.java                │     │
│  │   OkHttp + Retrofit + RxJava3        │     │
│  └─────────────┬────────────────────────┘     │
│                │  HTTP sobre Tailscale VPN     │
│  ┌─────────────▼────────────────────────┐     │
│  │  tailscalebridge.aar  (Go/tsnet)     │     │
│  │  Túnel cifrado WireGuard             │     │
│  └─────────────┬────────────────────────┘     │
└────────────────┼─────────────────────────────-┘
                 │  WireGuard / Tailscale Mesh
┌────────────────▼──────────────────────────────┐
│            SERVIDOR LUBUNTU (100.112.239.82)  │
│                                               │
│  Spring Boot 3 + WebFlux (Puerto 8080)        │
│  ┌──────────────────────────────────────┐     │
│  │  JwtAuthFilter → REST Controller     │     │
│  │  BattleController / CraftingService  │     │
│  └─────────────┬─────────┬─────────────┘     │
│                │         │                    │
│  ┌─────────────▼─┐  ┌───▼──────────────┐     │
│  │  R2DBC        │  │  RSocket Port 7000│     │
│  │  Supabase PG  │  │  Batalla real-time│     │
│  └───────────────┘  └──────────────────┘     │
│                                               │
│  Redis (caché)  RabbitMQ (eventos async)      │
└───────────────────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────┐
│  SUPABASE (PostgreSQL gestionado en la nube)  │
│  Tablas: users, birds, inventory, battles...  │
└───────────────────────────────────────────────┘
```

---

## 2. Frontend (React 18 + Vite + TypeScript + Capacitor)

### 2.1 Stack

| Lib | Versión | Uso |
|---|---|---|
| React | 18.3.1 | UI reactiva |
| Vite | ^5.4 | Bundler + dev server |
| TypeScript | ^5.5 | Tipado estático |
| Capacitor | 8.1.0 | Bridge JS ↔ Android |
| Zustand | ^5.0 | Estado global (persistido) |
| Tailwind CSS | **v4** | Utility-first CSS |
| Framer Motion | ^12 | Animaciones |
| Leaflet + react-leaflet | 1.9 / 4.2 | Mapa de expedición |
| Zustand i18n | Custom | Soporte ES/EN dinámico |

### 2.2 Tailwind CSS v4 — Configuración

> **Importante:** Se usa **Tailwind v4**. La configuración NO está en `tailwind.config.js` sino en `src/index.css` mediante `@theme {}`.

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #5ee830;
  --color-cream: #fdfbf7;
  --font-display: 'Lexend', sans-serif;
  /* ... resto de tokens */
}
```

El `postcss.config.js` usa `@tailwindcss/postcss` (plugin oficial de TW4).
El fichero `tailwind.config.js` existe solo como referencia legacy; TW4 lo ignora.

### 2.3 Arquitectura SPA (sin React Router)

La navegación se gestiona mediante `currentScreen` en el Zustand store:

```
App.tsx → switch(currentScreen) → pantalla activa
```

| Screen key | Componente | Estado |
|---|---|---|
| `home` | `ElSantuario.tsx` | ✅ Implementado |
| `expedition` | `LaExpedicion.tsx` | ✅ Implementado |
| `arena` | `ElCertamen.tsx` | ✅ Implementado |
| `social` | `ElSocial.tsx` | ✅ Implementado |
| `store` | `ElTienda.tsx` | ✅ Implementado |
| `profile` | `MiPerfil.tsx` | ✅ Implementado |
| `taller` | `ElTaller.tsx` | 🔧 Pendiente (Fase 4) |
| `album` | `ElAlbum.tsx` | 🔧 Pendiente (Fase 4) |

### 2.4 Estado Global (Zustand)

```
store/useAppStore.ts
  ├── State:   playerBirds, inventory, currentUser, weather, time, notifications...
  ├── Persist: currentUser + playerBirds → localStorage (key: 'aery-storage')
  └── Actions: login, syncInventory, syncPlayerBirds, hydrateBirdMedia, executeAttack...
```

---

## 3. Capa Nativa Android (Java + Hilt + Retrofit)

### 3.1 Plugins Capacitor

| Plugin | Archivo Java | Métodos expuestos a JS |
|---|---|---|
| `AvisCore` | `AvisCorePlugin.java` | `fetchInventory`, `getPlayerBirds`, `executeBattleAttack`, `storeSecureToken`, `getSecureToken` |
| `TailscalePlugin` | `TailscalePlugin.java` | `initTailscale`, `stopTailscale`, `testTailscaleConnection` |

**Patrón obligatorio** — los plugins Capacitor no son inyectables por Hilt directamente:

```java
@EntryPoint
@InstallIn(SingletonComponent.class)
interface AvisCoreEntryPoint {
    AvisApiService apiService();
}
// Uso dentro del plugin:
AvisApiService svc = EntryPoints.get(
    getContext().getApplicationContext(),
    AvisCoreEntryPoint.class
).apiService();
```

### 3.2 Módulos Hilt

| Módulo | Provee |
|---|---|
| `NetworkModule.java` | `OkHttpClient`, `Retrofit` → `AvisApiService`. BASE_URL: `http://100.112.94.34:8080/` |
| `DatabaseModule.java` | `AppDatabase` (Room), `BirdDao` |

### 3.3 Endpoints Retrofit (`AvisApiService.java`)

| Método HTTP | Endpoint | Uso |
|---|---|---|
| POST | `/api/auth/login` | Autenticación JWT |
| POST | `/api/auth/register` | Registro de usuario |
| GET | `/api/collection` | Lista de aves del jugador |
| GET | `/api/inventory` | Inventario de materiales |
| POST | `/api/crafting/craft` | Crear carta de ave |
| POST | `/api/expeditions/start` | Iniciar expedición |
| POST | `/api/battle/attack` | Acción de combate (RSocket) |
| GET/POST | `/api/market` | Marketplace |

### 3.4 Compilar tailscalebridge.aar

```powershell
# Prerequisitos: Go instalado, NDK 25.x
cd C:\Users\rober\Desktop\ProyectoIntermodularDAM\tailscalebridge

$env:ANDROID_HOME     = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_NDK_HOME = "$env:LOCALAPPDATA\Android\Sdk\ndk\25.0.8775105"

gomobile init
gomobile bind -v -target=android -androidapi 21 -o tailscalebridge.aar .
copy tailscalebridge.aar ..\Cliente\android\app\libs\
```

Resultado: `tailscalebridge.aar` (~60 MB, arm64 + armeabi-v7a + x86 + x86_64).

---

## 4. Conectividad — Tailscale VPN

```
Android App  ──[tailscalebridge.aar/Go tsnet]──▶  Tailscale Mesh ──▶  Servidor Maestro
                                                                         100.112.94.34
```

- El plugin `TailscalePlugin.java` llama a `TailscaleLib.initTailscale()` antes de cualquier petición Retrofit.
- `NetworkModule.java` configura `BASE_URL = http://100.112.94.34:8080/`.
- Procedimiento de Bootstrap: La app usa `aery-bootstrap` y una AuthKey compartida para el acceso inicial.
- Post-Login: Reconfiguración dinámica a `aery-<username>` con credenciales privadas.
- El servidor Spring Boot escucha en `server.address: 0.0.0.0` para aceptar conexiones de la interfaz virtual de Tailscale.
- Acceso SSH al servidor: `ssh lubuntu@100.112.94.34` (password en Bitácora).

---

## 5. Backend (Spring Boot 4.0.0 + WebFlux)

### 5.1 Arquitectura Reactiva

| Concepto | Implementación |
|---|---|
| Servidor | Netty (Event Loop, non-blocking) |
| API REST | WebFlux Controllers (`Mono<T>` / `Flux<T>`) |
| Tiempo real | RSocket (puerto 7000) — batallas 1v1 |
| Persistencia | Spring Data R2DBC → Supabase PostgreSQL |
| Caché | Redis Reactive + Redisson (locks distribuidos) |
| Mensajería | RabbitMQ AMQP → recompensas post-combate |

### 5.2 Seguridad

- JWT (HS512) validado en `JwtUtil` por `WebFilterChain` antes de llegar al controller.
- Stateless — sin sesiones en servidor.
- Token almacenado en el cliente con `EncryptedSharedPreferences` (no localStorage).

### 5.3 Módulos de Juego

| Módulo | Tecnología | Descripción |
|---|---|---|
| Autenticación | Spring Security + JWT | `/api/auth/login|register` |
| Catálogo | WebClient → Nuthatch API | Datos taxonómicos on-demand |
| Colección + Taller | R2DBC (atómico) | Crafting: consume materiales → genera BirdCard |
| Certamen | RSocket channel bidireccional | Matchmaking + ataques en tiempo real |
| Marketplace | Redis + Redisson (distributed lock) | Anti-doble-gasto en compras simultáneas |
| Eventos | RabbitMQ `@RabbitListener` | Recompensas asíncronas post-batalla |
| Clima | wttr.in (WebClient, sin API key) | Modifica probabilidades de crafteo |

### 5.4 APIs Externas

| API | Uso |
|---|---|
| **Nuthatch API** | Nombre científico, familia, audio del canto |
| **wttr.in** | Clima actual sin API key |
| **Pexels API** | Imágenes de aves y hábitats |
| **DiceBear API** | Avatares de usuario SVG |

---

## 6. Supabase (PostgreSQL)

- Supabase gestiona PostgreSQL en la nube.
- Spring Boot se conecta via **R2DBC** (driver async, no JDBC).
- Los IDs son **UUID** (emparejan con Supabase Auth).
- **Prohibido:** columnas JSONB — solo relacional puro.
- Tablas principales: `users`, `bird_cards`, `inventory_items`, `expeditions`, `battles`, `market_listings`.

---

## 7. Script de Build Automatizado

```powershell
# Build completo (Frontend → Capacitor → APK debug)
.\build_full.ps1

# APK de release
.\build_full.ps1 -Mode release

# Solo Android (si el frontend no cambió)
.\build_full.ps1 -SkipFrontend
```

**Pasos internos:**
1. `npm run build` en `Cliente/` (Vite + tsc)
2. `npx cap sync android` (copia `dist/` a WebView Android)
3. `gradlew assembleDebug` o `assembleRelease`
4. Informa la ruta del APK generado + comando `adb install`

---

## 8. Entorno de Desarrollo

| Máquina | Herramientas |
|---|---|
| **Windows (cliente)** | Node 24, npm, Android Studio, Go, gomobile, Tailscale |
| **Lubuntu (servidor)** | Java 21, Maven, Docker (Redis + RabbitMQ), Tailscale |

**Acceso rápido al servidor:**
```bash
ssh lubuntu@100.112.239.82
# Ver logs de Spring Boot en tiempo real:
ssh lubuntu@100.112.239.82 "journalctl -u avis-backend -f"
```
