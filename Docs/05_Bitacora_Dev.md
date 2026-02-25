# 05 BitÃ¡cora Dev

## Registro de Errores y Soluciones

### Error: Incompatible React versions (react vs react-dom)

**Fecha:** 2026-02-23
**Contexto:** Al configurar React Native Web con Vite e instalar `react-dom` sin especificar versiÃ³n.
**SÃ­ntoma:** Pantalla blanca en `localhost:5173`. En la consola del navegador aparece:

```text
Uncaught Error: Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:
- react: 19.2.3
- react-dom: 19.2.4
```

**Causa:** El proyecto base de React Native venÃ­a con `react@19.2.3`. Al instalar `react-dom` mediante `npm install react-dom`, npm descargÃ³ la Ãºltima versiÃ³n disponible (`19.2.4`), causando una discrepancia estricta exigida por React.
**SoluciÃ³n:** Forzar la re-instalaciÃ³n explÃ­cita de ambas librerÃ­as en la misma versiÃ³n exacta usando:
`npm install react@19.2.3 react-dom@19.2.3 --legacy-peer-deps`

### Error: Pantalla en blanco ("Element type is invalid: expected a string but got: object")

**Fecha:** 2026-02-24
**Contexto:** Montaje del punto de entrada en web (`index.web.js`) en React Native Web usando Vite.
**SÃ­ntoma:** Compila correctamente (exit 0), pero al abrir en localhost muestra una pantalla en blanco. En la consola del navegador salta el error: `Uncaught Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.`
**Causa:** Conflicto de resoluciÃ³n de mÃ³dulos de Vite al faltar la extensiÃ³n explÃ­cita. El archivo `index.web.js` contenÃ­a `import App from './App'`. Al existir tanto `App.tsx` (el componente) como `app.json` (configuraciÃ³n) en el mismo nivel, Vite resolvÃ­a e importaba `app.json` en lugar de `App.tsx`. Esto pasÃ³ a React un objeto JSON puro (con configuraciÃ³n) en lugar de un React Node vÃ¡lido, provocando el fallo de render.
**SoluciÃ³n:** Modificar la importaciÃ³n en `index.web.js` para exigir explÃ­citamente la extensiÃ³n: `import App from './App.tsx'`.

### RefactorizaciÃ³n UUID y ConfiguraciÃ³n IDE (Backend)

**Fecha:** 2026-02-24
**Contexto:** PreparaciÃ³n del modelo de datos de Spring Boot para integrarse con Supabase Auth y base de datos, ademÃ¡s de fallos de compilaciÃ³n con la extensiÃ³n de Java de Visual Studio Code.
**SÃ­ntoma:** El IDE marcaba en rojo todas las clases Java indicando "No se encuentra el paquete `java.lang.String`" o dependencias externas ignoradas, aunque por comando la compilaciÃ³n `mvn clean compile` era exitosa.
**Causa:** El editor abrÃ­a la carpeta raÃ­z del proyecto (`ProyectoIntermodularDAM`), pero el proyecto Maven real estaba anidado dentro de la carpeta `src/backend`. El servidor de lenguaje Java se desorientaba al no encontrar ningÃºn `pom.xml` en la raÃ­z que declarara los mÃ³dulos.
**SoluciÃ³n:**
1.  **RefactorizaciÃ³n del Modelo (`Long` a `UUID`):** Todas las entidades, DTOs y controladores (`BattleSession`, `AuctionItem`, `MarketplaceController`, etc.) ahora usan el tipo `UUID` (en lugar de `Long` autoincremental simulaciÃ³n H2) para emparejarse con el sistema nativo de identidades de Supabase.
2.  **POM Agregador:** Se creÃ³ un archivo `pom.xml` en la carpeta raÃ­z (`ProyectoIntermodularDAM/pom.xml`) de tipo `packaging: pom` apuntando al submÃ³dulo `<module>src/backend</module>`. Esto resolviÃ³ la detecciÃ³n automÃ¡tica de Java en VS Code.

### Error: Backend inaccesible desde IP de Tailscale (Timeout)

**Fecha:** 2026-02-24
**Contexto:** Despliegue en desarrollo de Endpoints de Spring Boot (`8080`) e intento de conectar el cliente mÃ³vil vÃ­a proxy de Tailscale (`http://100.112.239.82:8080/api/auth/login`).
**SÃ­ntoma:** Al lanzar una peticiÃ³n cURL o probar con el frontend contra la IP de Tailscale, la conexiÃ³n fallaba tras 21 segundos por `Timeout` (Failed to connect). Localmente (en `localhost:8080` sÃ­ devolvÃ­a `401 Unauthorized` correctamente segÃºn la lÃ³gica interna de la API REST).
**Causa:** Spring Boot por defecto `server.address` lo adhiere limitadamente. Pero sobre todo, el cortafuegos perimetral del PC (Firewall de Windows) bloqueaba automÃ¡ticamente las conexiones TCP entrantes al puerto 8080 originadas desde la subred de la tarjeta de red virtual creada por Tailscale.
**SoluciÃ³n:**
1.  **En `application.yml`**: Configurada globalmente a `server.address: 0.0.0.0` para obligar a Spring Boot a escuchar indiscriminadamente en todos los adaptadores de red de la mÃ¡quina huÃ©sped (incluido Tailscale).
2.  **Firewall de Windows**: Configurar explÃ­citamente una nueva Regla de Entrada en `wf.msc` permitiendo trÃ¡fico concurrente `TCP 8080` a perfiles pÃºblicos/privados generados por la interfaz del tÃºnel VPN de Tailscale.

### Acceso Remoto al Servidor (Pruebas y Logs)

**Fecha:** 2026-02-24
**Contexto:** Necesidad de verificar archivos generados por el backend (por ejemplo, \pruebaConexion.txt\) en el servidor remoto Lubuntu durante el testing.
**Procedimiento:**
Dado que el servidor está conectado a la Tailnet (IP \100.112.239.82\), se puede acceder de forma segura y directa por SSH desde cualquier equipo de desarrollo autorizado, sin lidiar con redirección de puertos del router.

1.  **Conexión SSH vía Tailscale:**
    Para entrar al servidor y tener interactividad total:
    \ssh lubuntu@100.112.239.82\
    *(Se solicitará la contraseña del usuario \lubuntu\, que actualmente es \Mbba6121.\)*.

2.  **Búsqueda y Lectura Rápida de Archivos Vía SSH:**
    Si solo se desea buscar un archivo de prueba (ej. \pruebaConexion.txt\) y volcar su contenido directamente en la terminal local sin abrir una sesión interactiva, se puede pasar el comando directamente:
    \ssh lubuntu@100.112.239.82 "find /home/lubuntu -name pruebaConexion.txt -type f -exec cat {} + "\

**Nota Técnica (Troubleshooting):** Si tras iniciar el túnel \	ailscale up\ localmente los endpoints \http://100.112.239.82:8080/...\ arrojan Timeout, pero por SSH el acceso es correcto, el problema reside en la **ausencia del servicio Spring Boot** levantado en el servidor remoto, o que el Firewall UFW de Lubuntu está bloqueando el puerto 8080.

---

# BitÃ¡cora del Frontend: AVIS

Este documento registra la arquitectura, estructura y componentes principales del frontend de la aplicaciÃ³n **AVIS (El Cuaderno de Campo Vivo)**.

## IntroducciÃ³n
El proyecto frontend estÃ¡ desarrollado utilizando **React (versiÃ³n 19)** con **Vite**. La configuraciÃ³n estÃ¡ orientada a soportar **React Native para Web** (`react-native-web`), lo que permite escribir componentes usando primitivas como `View`, `Text` y `StyleSheet`, y renderizarlos perfectamente en un entorno de navegador web.

## Arquitectura y Estructura de Directorios
El cÃ³digo fuente principal se encuentra en `src/frontend/src/`. La arquitectura se divide en capas de la siguiente manera:

### 1. Componentes (`/components`)
Contiene los elementos visuales reutilizables de la interfaz, que conforman el Design System (Glassmorphism).
- `BottomBar.tsx` / `MoreMenu.tsx`: NavegaciÃ³n principal del juego.
- `BirdCardView.tsx`: Tarjeta de visualizaciÃ³n de los pÃ¡jaros.
- `GlassCard.tsx`: Contenedor base con efecto de cristal (blur).
- `ResourceCounter.tsx`: UI para mostrar monedas y recursos.
- `WeatherBackground.tsx`: Fondo animado dinÃ¡mico dependiendo del clima.

### 2. Pantallas (`/screens`)
Cada archivo aquÃ­ representa una vista o "pÃ¡gina" completa dentro de la aplicaciÃ³n.
- **AutenticaciÃ³n:** `LoginScreen.tsx`, `RegisterScreen.tsx`.
- **Core Game:**
  - `SantuarioScreen.tsx`: Es el hub principal (Home) del juego. Destaca por tener un fondo dinÃ¡mico (`WeatherBackground`), un Ã¡rbol con animaciones CSS complejas (balanceo, caÃ­da de hojas) donde se posan los pÃ¡jaros (mostrando hasta 5 aves de la colecciÃ³n). Incluye un panel superior con el clima actual y los recursos del jugador (semillas, notas, reputaciÃ³n). Usa variables de fase del dÃ­a (MaÃ±ana, MediodÃ­a, Tarde, Noche) para cambiar tintes de color e iconos.
  - `ExpedicionScreen.tsx`: Sistema para conseguir materiales de crafteo. El jugador elige un Bioma (Bosque, Costa, MontaÃ±a) y un Cebo (Gusano, Fruta, Pez) que cuesta Semillas, para iniciar un temporizador. Incluye un minijuego de "Enfoque" (cÃ¡mara fotogrÃ¡fica) usando un slider para atrapar el "sweet spot" y ganar Notas de Campo extra de manera iterativa mientras dura la expediciÃ³n.
- **Sistemas de Juego:**
  - `CertamenScreen.tsx`: Implementa el sistema de combate (Duelos 1v1). Utiliza un sistema estilo piedra-papel-tijeras llamado "TriÃ¡ngulo de Poder" con posturas: Canto vence a Plumaje, Plumaje vence a Vuelo, Vuelo vence a Canto. La UI incluye selecciÃ³n de ave, la arena de batalla con animaciones, y una pantalla de resoluciÃ³n del duelo indicando recompensas en Semillas y ReputaciÃ³n (`playerRep`).
  - `FlockScreen.tsx` (la bandada/equipo del jugador).
  - `CoopScreen.tsx` (gestiÃ³n del nido/cooperativa).
  - `TallerScreen.tsx`: Interfaz de crafteo (crafting). Muestra una mesa de trabajo de madera con 3 slots (Foto, Pluma, Notas) y un inventario inferior con los materiales del jugador. Al colocar correctamente los tres materiales, se activa una animaciÃ³n de "Pintando carta con acuarelas", lo que simula la creaciÃ³n y registro de una nueva ave en el cuaderno/colecciÃ³n.
- **EconomÃ­a:** `MarketScreen.tsx`.
- **Coleccionables:** `AlbumScreen.tsx`.
- **Social/Usuario:** `ProfileScreen.tsx`, `NotificationsScreen.tsx`.

### 3. Contexto Global (`/context`)
Se utiliza la Context API de React junto con hooks y reducers para gestionar el estado global.
- `AuthContext.tsx`: GestiÃ³n de sesiÃ³n de usuario y JWT.
- `GameContext.tsx`: Estado principal del jugador (monedas, energÃ­a, clima).
- `FlockContext.tsx`: GestiÃ³n de los pÃ¡jaros del jugador.
- `MarketContext.tsx`: Estado de la tienda y el mercado.
- `CoopContext.tsx`: Estado de la cooperativa/nido.

### 4. Servicios (`/services`)
Encargados de la comunicaciÃ³n con el Backend (Spring Boot).
- `apiClient.ts`: ConfiguraciÃ³n base de fetch/axios con interceptores para JWT.
- `authService.ts`: Llamadas a la API de registro y login.

### 5. Tipos (`/types`)

# BitÃ¡cora del Frontend: AVIS

Este documento registra la arquitectura, estructura y componentes principales del frontend de la aplicaciÃ³n **AVIS (El Cuaderno de Campo Vivo)**.

## IntroducciÃ³n
El proyecto frontend estÃ¡ desarrollado utilizando **React (versiÃ³n 19)** con **Vite**. La configuraciÃ³n estÃ¡ orientada a soportar **React Native para Web** (`react-native-web`), lo que permite escribir componentes usando primitivas como `View`, `Text` y `StyleSheet`, y renderizarlos perfectamente en un entorno de navegador web.

## Arquitectura y Estructura de Directorios
El cÃ³digo fuente principal se encuentra en `src/frontend/src/`. La arquitectura se divide en capas de la siguiente manera:

### 1. Componentes (`/components`)
Contiene los elementos visuales reutilizables de la interfaz, que conforman el Design System (Glassmorphism).
- `BottomBar.tsx` / `MoreMenu.tsx`: NavegaciÃ³n principal del juego.
- `BirdCardView.tsx`: Tarjeta de visualizaciÃ³n de los pÃ¡jaros.
- `GlassCard.tsx`: Contenedor base con efecto de cristal (blur).
- `ResourceCounter.tsx`: UI para mostrar monedas y recursos.
- `WeatherBackground.tsx`: Fondo animado dinÃ¡mico dependiendo del clima.

### 2. Pantallas (`/screens`)
Cada archivo aquÃ­ representa una vista o "pÃ¡gina" completa dentro de la aplicaciÃ³n.
- **AutenticaciÃ³n:** `LoginScreen.tsx`, `RegisterScreen.tsx`.
- **Core Game:**
  - `SantuarioScreen.tsx`: Es el hub principal (Home) del juego. Destaca por tener un fondo dinÃ¡mico (`WeatherBackground`), un Ã¡rbol con animaciones CSS complejas (balanceo, caÃ­da de hojas) donde se posan los pÃ¡jaros (mostrando hasta 5 aves de la colecciÃ³n). Incluye un panel superior con el clima actual y los recursos del jugador (semillas, notas, reputaciÃ³n). Usa variables de fase del dÃ­a (MaÃ±ana, MediodÃ­a, Tarde, Noche) para cambiar tintes de color e iconos.
  - `ExpedicionScreen.tsx`: Sistema para conseguir materiales de crafteo. El jugador elige un Bioma (Bosque, Costa, MontaÃ±a) y un Cebo (Gusano, Fruta, Pez) que cuesta Semillas, para iniciar un temporizador. Incluye un minijuego de "Enfoque" (cÃ¡mara fotogrÃ¡fica) usando un slider para atrapar el "sweet spot" y ganar Notas de Campo extra de manera iterativa mientras dura la expediciÃ³n.
- **Sistemas de Juego:**
  - `CertamenScreen.tsx`: Implementa el sistema de combate (Duelos 1v1). Utiliza un sistema estilo piedra-papel-tijeras llamado "TriÃ¡ngulo de Poder" con posturas: Canto vence a Plumaje, Plumaje vence a Vuelo, Vuelo vence a Canto. La UI incluye selecciÃ³n de ave, la arena de batalla con animaciones, y una pantalla de resoluciÃ³n del duelo indicando recompensas en Semillas y ReputaciÃ³n (`playerRep`).
  - `FlockScreen.tsx` (la bandada/equipo del jugador).
  - `CoopScreen.tsx` (gestiÃ³n del nido/cooperativa).
  - `TallerScreen.tsx`: Interfaz de crafteo (crafting). Muestra una mesa de trabajo de madera con 3 slots (Foto, Pluma, Notas) y un inventario inferior con los materiales del jugador. Al colocar correctamente los tres materiales, se activa una animaciÃ³n de "Pintando carta con acuarelas", lo que simula la creaciÃ³n y registro de una nueva ave en el cuaderno/colecciÃ³n.
- **EconomÃ­a:** `MarketScreen.tsx`.
- **Coleccionables:** `AlbumScreen.tsx`.
- **Social/Usuario:** `ProfileScreen.tsx`, `NotificationsScreen.tsx`.

### 3. Contexto Global (`/context`)
Se utiliza la Context API de React junto con hooks y reducers para gestionar el estado global.
- `AuthContext.tsx`: GestiÃ³n de sesiÃ³n de usuario y JWT.
- `GameContext.tsx`: Estado principal del jugador (monedas, energÃ­a, clima).
- `FlockContext.tsx`: GestiÃ³n de los pÃ¡jaros del jugador.
- `MarketContext.tsx`: Estado de la tienda y el mercado.
- `CoopContext.tsx`: Estado de la cooperativa/nido.

### 4. Servicios (`/services`)
Encargados de la comunicaciÃ³n con el Backend (Spring Boot).
- `apiClient.ts`: ConfiguraciÃ³n base de fetch/axios con interceptores para JWT.
- `authService.ts`: Llamadas a la API de registro y login.

### 5. Tipos (`/types`)
Definiciones de TypeScript para asegurar el tipado fuerte en toda la app.
- `auth.ts`, `coop.ts`, `market.ts`, `social.ts`, `types.ts` (entidades core como pÃ¡jaros, recursos, clima).

### 6. DiseÃ±o y Estilos (`/theme`)
- `theme.ts`: Contiene los Design Tokens (colores, espaciados, tipografÃ­a, bordes y sombras) bajo la metÃ¡fora visual de un Cuaderno de Campo BotÃ¡nico.

## Próximos Pasos Identificados
- **Continuación del Desarrollo Core:** La aplicación es plenamente funcional y el frontend renderiza correctamente sin errores en el navegador. Los scripts de inicio automático como `start_all.ps1` son plenamente funcionales y operan de acuerdo al diseño esperado.
- **Módulo 1:** Continuar con la refactorización de estilos a unidades relativas (rem, vh) en las vistas principales.
- **Módulo 5:** Proceder con la configuración de PWA.
