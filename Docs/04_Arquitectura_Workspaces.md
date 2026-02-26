# 04 Arquitectura Workspaces

## Mapa de Directorios

```text
[ProyectoIntermodularDAM]
├── .git/
├── .gitignore
├── pom.xml                    (Agregador Maven apuntando a src/backend)
├── Docs/                      (Repositorio de Conocimiento Vivo)
│   ├── Skills/
│   │   ├── Skill_Build_Tailscale_AAR.md
│   │   ├── Skill_DoubleReview.md
│   │   ├── Skill_Spring_Boot.md
│   │   ├── Skill_Web_Frontend.md
│   │   └── documentador.md
│   ├── 00_Reglas_Maestras.md
│   ├── 02_Diseño_UI_UX_y_Gameplay.md   ← UX + Mecánicas de Juego
│   ├── 03_Roadmap_Vivo.md
│   ├── 04_Arquitectura_Workspaces.md   ← este archivo
│   ├── 05_Bitacora_Dev.md
│   ├── 06_Arquitectura_Tecnica.md      ← Stack + Backend + Frontend + Android
│   └── 07_Arquitectura_Capacitor_Plugins.md
├── Cliente/                   (Capacitor + React 18 + Vite + TypeScript)
│   ├── android/               (Proyecto Nativo Android Java — Gradle/Hilt/Retrofit)
│   │   └── app/
│   │       ├── libs/          ← tailscalebridge.aar (compilado desde tailscalebridge/)
│   │       └── src/main/java/com/avis/cliente/
│   │           ├── plugins/   ← AvisCorePlugin.java, TailscalePlugin.java
│   │           ├── network/   ← AvisApiService.java (Retrofit)
│   │           ├── di/        ← NetworkModule.java (Hilt), DatabaseModule.java
│   │           └── db/        ← AppDatabase.java, BirdDao.java, BirdEntity.java
│   └── src/                   (Código Fuente React)
│       ├── components/        ← Navbar.tsx, BottomNav.tsx, GlassPanel.tsx
│       ├── data/              ← birds.ts (catálogo local)
│       ├── screens/           ← ElSantuario, LaExpedicion, ElCertamen, Login...
│       ├── services/          ← avisCore.ts, weather.ts, time.ts
│       ├── store/             ← useAppStore.ts (Zustand)
│       └── types/             ← index.ts
├── src/                       (Código Fuente Backend)
│   └── backend/               (Spring Boot 3 + WebFlux + Java 21)
├── tailscalebridge/           (Módulo Go — librería nativa Tailscale para Android)
│   ├── tailscalebridge.go     ← StartProxy(), Stop(), TestConnection()
│   ├── go.mod                 ← require tailscale.com v1.94.2 + golang.org/x/mobile
│   ├── go.sum
│   ├── build_aar.ps1          ← script PowerShell: compila + copia el .aar
│   └── install_ndk.ps1        ← script para instalar NDK desde cmdline-tools
└── avis-dev-tools/            (Scripts y utilidades)
```

## Convenciones de Organización
- Cualquier cambio estructural debe reflejarse en este archivo antes de implementarse.
- Los MCP config options se guardarán en `Docs/MCP`.
- Los flujos procedimentales de código se registrarán en `Docs/Skills`.
- El `tailscalebridge.aar` **nunca** se versiona en Git (`.gitignore`). Se regenera con `build_aar.ps1`.
