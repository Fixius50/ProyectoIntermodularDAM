# Skill: Desarrollo Web Frontend (PWA / React / Vite)

## Contexto
El usuario ha priorizado construir la App desde una base Web enfocada en PWA (Progressive Web App) para asegurar compatibilidad móvil universal a través del navegador, con vistas a usar Capacitor/WebView en el futuro si se requiere empaquetado nativo.

## Tecnologías Core
1. **React 18 + Vite** (Entorno de desarrollo rápido y robusto).
2. **React Router DOM** (Navegación tipo App).
3. **Zustand / Context API** (Gestor de Estado).
4. **CSS Vanilla / CSS Modules** (Para mantener el control exacto del Glassmorphism sín frameworks pesados).

## Principios de UI/UX (El Cuaderno de Campo Vivo)
- **Colores Principales:** Verde Salvia (`#7C9A92`), Terracota Suave (`#D9A08B`), Fondo Crema (`#FDFBF7`), Texto Oscuro (`#2C3E50`).
- **Tipografías:** Merriweather/Lora para Títulos, Nunito/Quicksand para cuerpo.
- **Estilo Visual (Glassmorphism):** Elementos semitransparentes sobre fondos dinámicos. Usar `backdrop-filter: blur(12px)`.
- **Formas:** Bordes redondeados (15px - 20px). No usar esquinas afiladas.
- **Responsive:** Contenedor central simulando pantalla móvil (`max-width: 480px`) en pantallas de escritorio, y `100vw, 100dvh` en móviles.

## Arquitectura Base (Prototipo actual en `src/web-prototype/`)
- `index.html`: Estructura principal, Bottom Navigation, Modales.
- `styles.css`: CSS Variables para paleta, layout Flexbox/Grid, animaciones base.
- `app.js`: Lógica de navegación entre "screens" (ocultando/mostrando divs), sistema de feedback háptico simulado y conexión inicial con APIs (Audio/Clima).

## Reglas de Implementación Web
1. Respetar las zonas seguras (`safe-area-inset`) para evitar solapamientos con las barras invertidas en iOS/Android cuando se pase a PWA/WebView.
2. Todo botón interactivo debe tener estilos de `:hover` (ligero scale/brillo) y `:active` (rebote o depresión).
3. Utilizar elementos semánticos (`<nav>`, `<main>`, `<article>`, `<button>`) para asegurar accesibilidad.
