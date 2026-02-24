# 04 Arquitectura Workspaces

## Mapa de Directorios (Plantilla)
```text
[ProyectoIntermodularDAM]
├── .git/
├── .gitignore
├── Docs/                  (Repositorio de Conocimiento Vivo)
│   ├── Skills/
│   ├── MCP/
│   ├── 00_Reglas_Maestras.md
│   ├── 01_Estrategia_Tecnica.md
│   ├── 02_Diseño_UI_UX.md
│   ├── 03_Roadmap_Vivo.md
│   ├── 04_Arquitectura_Workspaces.md
│   ├── 05_Bitacora_Dev.md
│   └── 06_Arquitectura_Frontend.md
├── src/                   (Código Fuente)
│   ├── backend/           (Spring Boot 3 + WebFlux)
│   └── frontend/          (React Native + Vite Hybrid)
│       ├── src/           (Componentes, Screens, Context)
│       └── App.tsx        (Navegación Core)
└── avis-dev-tools/        (Scripts y utilidades)
```

## Convenciones de Organización
- Cualquier cambio estructural en el repositorio de código debe reflejarse y documentarse primero en este archivo antes de implementarse.
- Los MCP config options (`mcp_config.json` si aplica a este entorno) se guardarán en `Docs/MCP`.
- Los flujos procedimentales de código se deben registrar en `Docs/Skills`.
