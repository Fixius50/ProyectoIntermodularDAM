# 03 Roadmap Vivo

## Fases del Proyecto

### Fase 1: Investigación y Configuración Documental (Activo 🟢)
- [x] Extracción de requerimientos de diseño, UX y arquitectura técnica (PDF).
- [x] Consolidación de información en `Docs/` base suite.
- [ ] Revisión y aprobación del alcance por el Promotor.

### Fase 2: Configuración Inicial del WorkSpace (Completado ✅)
- [x] Inicialización del proyecto Frontend (Estrategia PWA con React + Vite).
- [x] Inicialización del proyecto Backend (Spring Boot 3 + WebFlux).
- [x] Verificación de MCPs y Suite Documental (00-05).
- [x] Portabilidad de prototipo HTML/CSS a Componentes React.

### Fase 3: Desarrollo Core MVP (Activo 🟢)
- [ ] Módulo 1: UI Base (Santuario, Expedición, Taller, Certamen, Álbum) en React + Zustand.
  - [ ] Refactorización de estilos a unidades relativas (rem, vh).
- [x] Módulo 2: Autenticación con Supabase Auth e Integración de Persistencia (Backend).
- [x] Módulo 3: Motor de Expedición y Crafting (Backend - Integración Clima Real).
- [x] Módulo 4: Sistema de Certamen (Backend - RSocket Battle Core).
- [ ] Módulo 5: Configuración de PWA (Service Workers, Offline mode, Manifest).

### Fase 4: Refinamiento e Integración Externa (Completado ✅)
- [x] Integración de API de Clima (OpenWeatherMap).
- [x] Integración robusta de APIs (Nuthatch, Unsplash).
- [x] Módulo Social (Bandadas, Marketplace con Redis y Redisson).
- [x] Documentación Final de endpoints (Swagger/OpenAPI).
