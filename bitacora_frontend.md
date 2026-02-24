# Bitácora del Frontend: AVIS

Este documento registra la arquitectura, estructura y componentes principales del frontend de la aplicación **AVIS (El Cuaderno de Campo Vivo)**.

## Introducción
El proyecto frontend está desarrollado utilizando **React (versión 19)** con **Vite**. La configuración está orientada a soportar **React Native para Web** (`react-native-web`), lo que permite escribir componentes usando primitivas como `View`, `Text` y `StyleSheet`, y renderizarlos perfectamente en un entorno de navegador web.

## Arquitectura y Estructura de Directorios
El código fuente principal se encuentra en `src/frontend/src/`. La arquitectura se divide en capas de la siguiente manera:

### 1. Componentes (`/components`)
Contiene los elementos visuales reutilizables de la interfaz, que conforman el Design System (Glassmorphism).
- `BottomBar.tsx` / `MoreMenu.tsx`: Navegación principal del juego.
- `BirdCardView.tsx`: Tarjeta de visualización de los pájaros.
- `GlassCard.tsx`: Contenedor base con efecto de cristal (blur).
- `ResourceCounter.tsx`: UI para mostrar monedas y recursos.
- `WeatherBackground.tsx`: Fondo animado dinámico dependiendo del clima.

### 2. Pantallas (`/screens`)
Cada archivo aquí representa una vista o "página" completa dentro de la aplicación.
- **Autenticación:** `LoginScreen.tsx`, `RegisterScreen.tsx`.
- **Core Game:**
  - `SantuarioScreen.tsx`: Es el hub principal (Home) del juego. Destaca por tener un fondo dinámico (`WeatherBackground`), un árbol con animaciones CSS complejas (balanceo, caída de hojas) donde se posan los pájaros (mostrando hasta 5 aves de la colección). Incluye un panel superior con el clima actual y los recursos del jugador (semillas, notas, reputación). Usa variables de fase del día (Mañana, Mediodía, Tarde, Noche) para cambiar tintes de color e iconos.
  - `ExpedicionScreen.tsx`: Sistema para conseguir materiales de crafteo. El jugador elige un Bioma (Bosque, Costa, Montaña) y un Cebo (Gusano, Fruta, Pez) que cuesta Semillas, para iniciar un temporizador. Incluye un minijuego de "Enfoque" (cámara fotográfica) usando un slider para atrapar el "sweet spot" y ganar Notas de Campo extra de manera iterativa mientras dura la expedición.
- **Sistemas de Juego:**
  - `CertamenScreen.tsx`: Implementa el sistema de combate (Duelos 1v1). Utiliza un sistema estilo piedra-papel-tijeras llamado "Triángulo de Poder" con posturas: Canto vence a Plumaje, Plumaje vence a Vuelo, Vuelo vence a Canto. La UI incluye selección de ave, la arena de batalla con animaciones, y una pantalla de resolución del duelo indicando recompensas en Semillas y Reputación (`playerRep`).
  - `FlockScreen.tsx` (la bandada/equipo del jugador).
  - `CoopScreen.tsx` (gestión del nido/cooperativa).
  - `TallerScreen.tsx`: Interfaz de crafteo (crafting). Muestra una mesa de trabajo de madera con 3 slots (Foto, Pluma, Notas) y un inventario inferior con los materiales del jugador. Al colocar correctamente los tres materiales, se activa una animación de "Pintando carta con acuarelas", lo que simula la creación y registro de una nueva ave en el cuaderno/colección.
- **Economía:** `MarketScreen.tsx`.
- **Coleccionables:** `AlbumScreen.tsx`.
- **Social/Usuario:** `ProfileScreen.tsx`, `NotificationsScreen.tsx`.

### 3. Contexto Global (`/context`)
Se utiliza la Context API de React junto con hooks y reducers para gestionar el estado global.
- `AuthContext.tsx`: Gestión de sesión de usuario y JWT.
- `GameContext.tsx`: Estado principal del jugador (monedas, energía, clima).
- `FlockContext.tsx`: Gestión de los pájaros del jugador.
- `MarketContext.tsx`: Estado de la tienda y el mercado.
- `CoopContext.tsx`: Estado de la cooperativa/nido.

### 4. Servicios (`/services`)
Encargados de la comunicación con el Backend (Spring Boot).
- `apiClient.ts`: Configuración base de fetch/axios con interceptores para JWT.
- `authService.ts`: Llamadas a la API de registro y login.

### 5. Tipos (`/types`)
Definiciones de TypeScript para asegurar el tipado fuerte en toda la app.
- `auth.ts`, `coop.ts`, `market.ts`, `social.ts`, `types.ts` (entidades core como pájaros, recursos, clima).

### 6. Diseño y Estilos (`/theme`)
- `theme.ts`: Contiene los Design Tokens (colores, espaciados, tipografía, bordes y sombras) bajo la metáfora visual de un Cuaderno de Campo Botánico.

## Próximos Pasos Identificados
- **Error de Renderizado Inicial:** Investigar por qué al cargar `http://localhost:5173/` la aplicación monta correctamente el entorno pero lanza un error en consola dentro del renderizado de React (relacionado posiblemente con la carga inicial de estado o routing), mostrando una página en blanco.

