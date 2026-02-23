# Skill: Desarrollo React Native (UI Base & Glassmorphism)

## Contexto
Este proyecto utiliza React Native CLI para construir una app híbrida iOS/Android.

## Principios de UI/UX
- **Colores Principales:** Verde Salvia (`#7C9A92`), Terracota Suave (`#D9A08B`), Fondo Crema (`#FDFBF7`), Texto Oscuro (`#2C3E50`).
- **Tipografías:** Merriweather/Lora para Títulos, Nunito/Quicksand para cuerpo.
- **Estilo Visual (Glassmorphism):** Elementos semitransparentes sobre fondos dinámicos, bordes redondeados (20px). No usar esquinas afiladas.

## Componentes Funcionales Base
1. `WeatherBackground`: Contenedor principal para las vistas con fondo dinámico animado (SVG/Lottie).
2. `GlassCard`: Componente semitransparente para menús flotantes.
3. `BottomBar`: Navegación principal de 5 pestañas (Santuario, Expedición, Taller, Certamen, Álbum).

## Navegación
Se utilizará `react-navigation` (Stack y Bottom Tabs).

## Manejo de Estado
Utiliza Zustand o Context API para temas globales (Clima, Monedas, Inventario Básico).

## Reglas de Implementación
1. Evitar componentes de clase. Solo functional components con Hooks.
2. Todo botón debe tener información para lectores de pantalla (Semantics / Accessibility).
3. Añadir feedback háptico en interacciones importantes.
