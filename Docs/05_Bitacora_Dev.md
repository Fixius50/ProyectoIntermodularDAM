# 05 Bitácora Dev

## Registro de Errores y Soluciones

---

### Error: Incompatible React versions (react vs react-dom)

**Fecha:** 2026-02-23
**Contexto:** Al configurar React Native Web con Vite e instalar `react-dom` sin especificar versión.
**Síntoma:** Pantalla blanca en `localhost:5173`. En la consola del navegador aparece:

```text
Uncaught Error: Incompatible React versions: The "react" and "react-dom" packages must have
the exact same version. Instead got: react: 19.2.3, react-dom: 19.2.4
```

**Causa:** npm descargó la última versión de `react-dom` (19.2.4) mientras el proyecto usaba 19.2.3.
**Solución:** `npm install react@19.2.3 react-dom@19.2.3 --legacy-peer-deps`

---

### Error: Pantalla en blanco ("Element type is invalid: expected a string but got: object")

**Fecha:** 2026-02-24
**Contexto:** Montaje del punto de entrada `index.web.js` en React Native Web con Vite.
**Síntoma:** Compila correctamente (exit 0), pantalla en blanco. Consola: `Uncaught Error: Element type is invalid`.
**Causa:** Vite resolvía `App` como `app.json` (objeto de configuración) en lugar de `App.tsx`.
**Solución:** `import App from './App.tsx'` (extensión explícita).

---

### Refactorización UUID y Configuración IDE (Backend)

**Fecha:** 2026-02-24
**Contexto:** Preparación del modelo de datos de Spring Boot para integrarse con Supabase Auth.
**Síntoma:** IDE marcaba en rojo todas las clases Java aunque `mvn clean compile` era exitoso.
**Causa:** El IDE abría la carpeta raíz (`ProyectoIntermodularDAM`), pero el proyecto Maven estaba anidado en `src/backend`.
**Solución:**
1. Refactorización del modelo de `Long` a `UUID` para emparejar con Supabase.
2. Creación de `pom.xml` agregador en la raíz apuntando al submódulo `src/backend`.

---

### Error: Backend inaccesible desde IP de Tailscale (Timeout)

**Fecha:** 2026-02-24
**Contexto:** Intento de conectar desde el cliente contra `http://100.112.239.82:8080/api/auth/login`.
**Síntoma:** Timeout tras 21 segundos desde cURL o frontend. Localmente `localhost:8080` respondía correctamente.
**Causa:** El Firewall de Windows bloqueaba conexiones TCP entrantes en el puerto 8080 procedentes de la interfaz virtual de Tailscale.
**Solución:**
1. `application.yml`: `server.address: 0.0.0.0` (escuchar en todos los adaptadores).
2. Firewall de Windows (`wf.msc`): Regla de Entrada TCP 8080 para perfiles con interfaz Tailscale.

---

### Acceso Remoto al Servidor (Pruebas y Logs)

**Fecha:** 2026-02-24
**Procedimiento:** Acceso SSH vía Tailscale desde cualquier equipo de desarrollo:
```bash
ssh lubuntu@100.112.239.82
# Contraseña actual: Mbba6121.
```
Lectura rápida de archivos sin sesión interactiva:
```bash
ssh lubuntu@100.112.239.82 "find /home/lubuntu -name pruebaConexion.txt -exec cat {} +"
```
**Nota:** Si `http://100.112.239.82:8080` da Timeout pero SSH funciona → Spring Boot no está levantado, o UFW de Lubuntu bloquea el puerto 8080.

---

### Errores Frontend: `tailwindcss` no encontrado + Conflicto Git + Error TypeScript

**Fecha:** 2026-02-26
**Contexto:** Análisis del proyecto `Cliente/` revelando 3 errores bloqueantes.

**Error 1 — `tailwindcss` no encontrado en PostCSS:**
- **Causa:** `node_modules` incompleto tras migración del usuario de `Fixius50` a `rober`.
- **Solución:** `npm install` en `Cliente/` (321 paquetes instalados).

**Error 2 — Conflicto Git sin resolver en `ElSantuario.tsx`:**
- **Causa:** Marcadores `<<<<<<< HEAD` / `>>>>>>>` no resueltos del merge del commit `734b6b01`.
- **Solución:** Fusión manual conservando `inventory` (HEAD) y `addNotification` (rama entrante).

**Error 3 — TypeError TS2741 en `birds.ts`:**
- **Causa:** `CatalogBird extends Omit<Bird, 'status'>` pero los datos incluían `status`.
- **Solución:** Cambiar a `CatalogBird extends Bird`.

**Verificación:** `npx tsc --noEmit` → 0 errores.

---

### Integración Tailscale en Android: Compilación del `.aar` (gomobile)

**Fecha:** 2026-02-26
**Contexto:** Compilar `tailscalebridge/` como librería Android nativa `.aar` para incluir en el proyecto Capacitor.

**Error 1 — `gomobile` / `go` no reconocidos:**
- **Causa:** El PATH de la sesión de PowerShell no incluía el directorio de binarios de Go (`%GOPATH%\bin`).
- **Solución:** La sesión en la que se ejecutó `go install golang.org/x/mobile/cmd/gomobile@latest` sí tenía Go en PATH. Ejecutarse en esa misma sesión.

**Error 2 — NDK no utilizable: `unsupported API version 16 (not in 21..35)`:**
- **Causa:** NDK `ndk-bundle` (versión legacy 16) detectado en lugar del NDK instalado vía "Side by side".
- **Diagnóstico:** `dir "$env:LOCALAPPDATA\Android\Sdk\ndk"` → carpeta `25.0.8775105` (con `meta/platforms.json`, min=19 max=33).
- **Solución:** `$env:ANDROID_NDK_HOME = "$env:LOCALAPPDATA\Android\Sdk\ndk\25.0.8775105"` antes de ejecutar gomobile.

**Error 3 — `unable to import bind: no Go package in golang.org/x/mobile/bind`:**
- **Causa:** `go install` instala el binario de gomobile pero no siembra las fuentes de `golang.org/x/mobile` en el caché de módulos de Go. Al ejecutar `gomobile bind`, el binario `gobind` no encontraba el paquete fuente `bind`.
- **Solución:** Añadir `x/mobile` al `go.mod` del proyecto bridge:
  ```powershell
  cd tailscalebridge/
  go get golang.org/x/mobile@latest
  ```
  Esto añade `golang.org/x/mobile` a `go.mod` y siembra las fuentes en el módulo caché.

**Error 4 — gomobile bind fallaba con `-target=android` sin `-androidapi`:**
- **Causa:** gomobile leía el `minSdkVersion` de la configuración del SDK (valor 16) en lugar del NDK.
- **Solución:** Pasar `-androidapi 21` explícitamente:
  ```powershell
  gomobile bind -v -target=android -androidapi 21 -o tailscalebridge.aar .
  ```

**Resultado Final:**
- `tailscalebridge.aar` generado (~60 MB) con 4 arquitecturas: `arm64-v8a`, `armeabi-v7a`, `x86`, `x86_64`.
- Copiado automáticamente a `Cliente/android/app/libs/tailscalebridge.aar`.
- Script completo: `tailscalebridge/build_aar.ps1`.

**Comando completo funcional:**
```powershell
cd C:\Users\rober\Desktop\ProyectoIntermodularDAM\tailscalebridge

# En la misma sesión donde go/gomobile están en PATH:
$env:ANDROID_HOME     = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_NDK_HOME = "$env:LOCALAPPDATA\Android\Sdk\ndk\25.0.8775105"

gomobile init
gomobile bind -v -target=android -androidapi 21 -o tailscalebridge.aar .
copy tailscalebridge.aar ..\Cliente\android\app\libs\
```

---

### Integración Tailscale: Capa Android Java

**Fecha:** 2026-02-26
**Cambios realizados:**

| Archivo | Cambio |
|---|---|
| `TailscalePlugin.java` | Nuevo plugin Capacitor → `initTailscale`, `stopTailscale`, `testTailscaleConnection` |
| `AvisCorePlugin.java` | Reescrito con patrón Hilt EntryPoint; `executeBattleAttack` conectado a Retrofit real |
| `NetworkModule.java` | `BASE_URL` → `http://100.112.239.82:8080/` (Tailscale IP) |
| `AvisApiService.java` | Todos los endpoints: auth, colección, inventario, crafting, expedición, batalla, santuario |
| `MainActivity.java` | Registra `AvisCorePlugin` y `TailscalePlugin` |
| `build.gradle (app)` | `implementation(name: 'tailscalebridge', ext: 'aar')` |
| `avisCore.ts` | Interfaces `AvisCorePlugin` + `TailscalePluginInterface` + web mocks |

---

## Bitácora del Frontend: AVIS (Actualizada 26/02/2026)

El proyecto frontend usa **React 18 + Vite + TypeScript + Capacitor**.
*(Nota: la versión anterior de esta bitácora documentaba React Native Web — migrado completamente a React + Vite para mejor compatibilidad con Capacitor.)*

### Arquitectura de Capas (Cliente/src/)

```
src/
├── components/    → Navbar, BottomNav, GlassPanel (Glassmorphism)
├── data/          → birds.ts (catálogo local — 6 aves de Pinto)
├── screens/
│   ├── auth/      → Login.tsx
│   ├── home/      → ElSantuario.tsx (hub principal)
│   ├── expedition/→ LaExpedicion.tsx
│   └── arena/     → ElCertamen.tsx (batalla 1v1)
├── services/
│   ├── avisCore.ts → AvisCore + TailscalePlugin (Capacitor bridge)
│   ├── weather.ts  → wttr.in (API pública sin key)
│   └── time.ts     → fase del día (Morning/Afternoon/Night)
├── store/
│   └── useAppStore.ts → Zustand (persist + partialize)
└── types/index.ts     → Bird, User, AppState, etc.
```

### Gestión de Estado (Zustand)
- Store: `useAppStore.ts` — persistido en `localStorage` bajo la key `aery-storage`.
- Estado serializado: `playerBirds`, `inventory`, `currentUser`, `notifications`, `posts`.
- Acciones principales: `login`, `register`, `logout`, `syncInventory`, `syncPlayerBirds`, `executeAttack`.

### Pantallas Pendientes de Implementar
- `ElTaller` (Crafting): 3 slots drag-drop + animación acuarela.
- `ElAlbum` (Colección): grid de aves con modal de detalle (Cara A stats / Cara B lore).
