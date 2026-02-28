# 03 Roadmap Vivo

## 🗺️ Roadmap de Desarrollo

### Fase 1: Cimientos y Arquitectura [COMPLETO]
- [x] Definición de Stack Tecnológico (React 18 + Vite + TypeScript + Capacitor + Java).
- [x] Configuración de Workspace de Documentación (`Docs/`).
- [x] Estructura de Proyecto Base.

### Fase 2: Configuración Nativa Android (Java) [COMPLETO]
- [x] Integración de dependencias (Retrofit, Room, RxJava3, Hilt).
- [x] Creación de `AvisCorePlugin.java` (Bridge Capacitor inicial).
- [x] Generación de APK Inicial de prueba.
- [x] Compilación e integración de `tailscalebridge.aar` (Go/tsnet → gomobile).
- [x] `TailscalePlugin.java` → expone `initTailscale`, `stopTailscale`, `testTailscaleConnection`.
- [x] `NetworkModule.java` → `BASE_URL` apuntando a Tailscale IP `100.112.239.82:8080`.
- [x] `AvisApiService.java` → todos los endpoints REST (auth, colección, inventario, crafting, expedición, batalla, santuario).
- [x] `AvisCorePlugin.java` → reescrito con patrón Hilt `EntryPoint`.
- [x] `avisCore.ts` → interfaces TypeScript para `AvisCore` y `TailscalePlugin` con web mocks.

### Fase 3: Módulo 1: UI Base y Navegación [COMPLETO]
- [x] Implementación de Sistema de Diseño (Glassmorphism & Mobile-First).
- [x] Desarrollo de Pantalla de Login y Registro (estado mock).
- [x] Creación de Navbar y Bottom Navigation.
- [x] Layout principal y enrutado de pantallas core.
- [x] `tailwindcss` + `@capacitor/core` instalados (`npm install`).
- [x] Error de conflicto Git en `ElSantuario.tsx` resuelto.
- [x] Error TypeScript en `birds.ts` (`CatalogBird`) corregido.

### Fase 4: Módulo 2: Vinculación de Datos y Recursos [EN CURSO]
- [x] Conexión de UI con Zustand Store.
- [x] Implementación de `avisCore.ts` calls (mockados en web, reales en Android).
- [x] **Soporte Multi-idioma (i18n)**: Diccionarios ES/EN y selector de región.
- [x] **Gestión Proactiva de Permisos**: Solicitud nativa de Cámara, GPS y Audio.
- [x] **Optimización UI/UX**: Ajustes de Safe Area y responsividad en móviles.
- [ ] Sistema de Inventario y Plumas (pantalla `ElTaller`).
- [ ] Álbum de Colección (pantalla `ElAlbum`).
- [x] Persistencia de sesión segura via `storeSecureToken` / `getSecureToken`.
- [x] Integración real Room DB → `fetchInventory()` / `getPlayerBirds()` desde SQLite nativo.
- [/] Integración JWT: interceptor OkHttp + `storeSecureToken` en flujo login (pendiente interceptor nativo).

### Fase 5: Backend Integration [EN CURSO / BACKEND DISPONIBLE]
- [x] Módulo de Autenticación (Spring Boot REST `/api/auth`).
- [x] Módulo de Colección (`/api/collection`).
- [x] Motor de Expedición y Crafting (`/api/expeditions`, `/api/crafting`).
- [x] Sistema de Certamen (RSocket Battle Core + `/api/battle`).
- [x] Integración de API de Clima (OpenWeatherMap).
- [x] APIs externas (Nuthatch, Unsplash/Pexels).
- [x] Módulo Social (Bandadas, Marketplace con Redis y Redisson).
- [x] Documentación de endpoints (Swagger/OpenAPI).
