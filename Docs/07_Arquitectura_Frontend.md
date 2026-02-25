# 07. Arquitectura Funcional del Frontend (React / Next.js / Ionic)

Al igual que el servidor es un motor de alto rendimiento que no se bloquea, el **Cliente (Frontend)** de AVIS debe ser una interfaz hiper-dinámica ("Glassmorphism", animaciones de 60 FPS) que consuma datos asíncronos sin "congelar" la pantalla del dispositivo móvil al usuario.

Este documento no es una simple hoja de ruta, es una **Autopsia Técnica** del Cliente. Analiza en profundidad qué hace React bajo el capó, cómo operan los estados, y cómo asimila los paquetes de los microservicios Java (WebFlux, RSocket, JWT, RabbitMQ).

---

## 🏗️ 1. Filosofía de la Arquitectura: Reatividad UI e Hidratación

Las páginas web tradicionales cargan HTML desde el servidor por cada clic (Bloqueantes). Si el usuario abre su inventario, el servidor pinta toda la página y la manda por internet (Lento).

### ¿Qué hace React / Ionic aquí?

Usamos arquitectura de **Single Page Application (SPA)**. Cuando el usuario abre AVIS, se descarga todo el esqueleto visual de la aplicación una única vez. Todos los clics, transiciones, y menús ocurren **dentro de la memoria de su propio móvil/navegador**. La pantalla jamás se recarga. Las únicas peticiones que salen a internet van en busca de **JSON crudo** (los datos puros) que React inyecta en los botones y texturas instantáneamente.

> 🏢 **Equivalencia en el Mundo Real:**
> **Web Tradicional:** Es como comprar un mueble en Ikea, pero en vez de las tablas, te envían por correo el mueble entero montado. Si quieres cambiar una silla, envías el mueble viejo y correo te manda una silla nueva entera.
> **Nuestra Arquitectura Reactiva (React):** Te dan la caja de herramientas y las maderas (Aplicación) el primer día que la instalas. Cuando necesitas una silla, haces una llamada telefónica (Llamada asíncrona a la API) y te dicen las medidas exactas. Tú ensamblas la silla en tu casa en tiempo real. Es infinitamente más rápido y barato para el transporte.

---

## 🧠 2. Módulo UI Base: Virtual DOM y Gestión de Estados

Para crear el ecosistema visual (Glassmorphism vibrante), la aplicación móvil no puede perder rendimiento redibujando texturas pesadas.

- **Técnica:** React utiliza un `Shadow DOM` (Virtual DOM). En lugar de dibujar cada pluma y carta en la memoria de la tarjeta gráfica del móvil cada segundo (`Real DOM`), dibuja una "fotocopia matemática" invisible en memoria RAM.
- **Bajo el Capó:** Si tú en tu inventario ganas 50 Semillas por RabbitMQ, React cambia el número en la fotocopia invisible primero. Luego, usa un algoritmo llamado *Reconciliation* para comparar la fotocopia y la pantalla real. Se da cuenta de que solo el número de semillas difiere, y **solo** redibuja esos píxeles, ignorando todo el resto del fondo del bosque. Resultado: Fluidez total a 60 FPS sin gastar batería.

---

## 🔐 3. Módulo de Red: Seguridad Autenticada (El Portero JWT)

- **Técnica:** El móvil cuenta con un Contexto de Estado Global (ej. Zustand o Redux). Cuando haces el `/login`, recibe el `AuthResponse` que diseñamos en Java, el cual contiene el bloque criptográfico JWT.
- **Bajo el Capó (Interceptor HTTP):** Hemos diseñado un "Interceptor" en Axios/Fetch. Antes de que cualquier petición abandone el teléfono (ej. "Ver mi Inventario"), el Interceptor pega mágicamente la cabecera `Authorization: Bearer <token>` al paquete TCP/IP.
- **Seguridad Física:** El JWT no se guarda en el local storage vulnerable a ataques XSS si se expone la app en entorno web, sino en *Secure Storage* (almacén encriptado del OS en iOS/Android usando Ionic Capacitor) o Cookies `HttpOnly`.

> 🏢 **Equivalencia en la Vida Real:**
> El Token JWT es una **Pulsera VIP de Festival de Música in-falsificable**. En vez de que cada camarero o puerta (Endpoints WebFlux) le llame al jefe de policía (Base de Datos) enseñándole tu DNI para ver si tienes entradas válidas, el portero solo se molesta en mirar a tu muñeca, ve el sello brillante de la pulsera, sabe que es nuestra marca y te deja pasar en un milisegundo (Stateless Authentication).

---

## ⚔️ 4. Módulo de Certamen: Red TCP y Cliente RSocket-js

El PvP de AVIS no sirve con llamadas REST convencionales HTTP. Si te disparan un ataque "Plumaje", necesitas verlo arder en tu pantalla ahora mismo, no dentro de dos segundos.

- **Técnica:** Reemplazar el `fetch()` clásico por `RSocket-js` (o en su defecto WebSockets/Socket.io acoplado a STOMP) en un *Hook Custom* de React (`useBattleSocket()`).
- **El Búfer Reactivo:** Cuando el frontend se conecta al puerto 7000 de Java, crea un canal bidireccional puro. Cada vez que el rival (Player Uno) manda una orden y Java descuenta la vida, TCP empuja el evento binario hasta el móvil. React intercepta el Payload, sobreescribe el estado de tu barra de vida (`setOpponentHealth`), obligando al Virtual DOM a actualizar la pantalla instantáneamente disparando la animación de daño y bajando la barra roja.

> 🏢 **Equivalencia en la Vida Real:**
> Lo vimos desde la perspectiva del servidor, veámoslo desde del móvil de tu jugador: Es como tener tu radio Walkie Talkie siempre en **Frecuencia Abierta y Escuchando**. No tienes que apretar el botón cada 2 segundos preguntando: "¿Me han atacado? ¿Me han atacado?". Cuando hay un ataque silencioso en la base enemiga, simplemente escuchas un estruendo en el altavoz sin esperarlo.

---

## 🧲 5. Módulo Crafting y Marketplace: Mutaciones Puras

El Crafting (Módulo 3) y el Mercado (Módulo 5) utilizan *Optimistic UI Updates*.

- **Técnica:** Cuando el jugador pulsa "Crear Ave en el Taller" o "Comprar Carta por 500 semillas", **no esperamos a que Java responda** para engañar al ojo. React *engaña* la interfaz simulando éxito instantáneo (te resta las semillas en la pantalla e inyecta la baraja temporalmente) gracias al manejo de estados optimistas.
- **En la Sombra:** Paralelamente, React tira la red `POST` asíncrona hacia Spring Boot (MarketplaceController con Mutexes simulando Redis). Si en esos 20 milisegundos nuestro Mutex atómico Java dice: "¡Error! Doble gasto detectado, otro usuario lo compró simultáneamente!" El Backend revienta con un HTTP 400.
- **Rollback Visual:** React atrapa el Error 400 (`.catch()`), le muestra una notificación suave y visual ("*Has llegado tarde. El ave voló del mercado. Semillas reembolsadas*") y revierte el estado a su valor real quitándote el pájaro holográfico.

> 🏢 **Equivalencia en la Vida Real:**
> Vas a la taquilla del cine y el cajero (React) te da la entrada de Spiderman físicamente mientras tú pasas tu tarjeta de crédito por el TPV. Te sientes seguro con tu entrada física y das 2 pasos hacia la puerta. De repente la tarjeta pita y de error (Saldo Insuficiente de Mutex de Java). El cajero extiende la mano, arranca la entrada de tu puño y te dice que vuelvas a ahorrar. La agilidad visual fue real, la transacción final fue rigurosamente encriptada.

---

## 🎨 6. Diseño Visual (Tailwind UI + Animations)

Nuestra interfaz utilizará tecnologías CSS-IN-JS de alto octanaje sin bibliotecas prefabricadas anticuadas:

- **Componentización:** En lugar de tener una megapplikacion de código duro (Monolito Visual), diseñamos botones modulares aislados `<BirdCardGlass />` que reciben propiedades de color y stats, reaccionando holográficamente on-hover con transformaciones matemáticas en GPU.
- **Carga Peresosa (Lazy Loading):** Los gráficos pesados de un halcón no se descargan si estás solo en el taller. React "taja" el código (`Code Splitting`) en minipaquetes microscópicos, asegurando que la primera carga de la Interfaz apenas consuma unos KiloBytes.

---

# Frontend Architecture Overview (AVIS)

This document describes the structure and design patterns of the recently updated frontend.

## 🏗️ Technical Stack
- **Framework**: [React Native](https://reactnative.dev/) + [React Native for Web](https://necolas.github.io/react-native-web/).
- **Build System**: [Vite](https://vitejs.dev/) for fast development and web builds.
- **Language**: TypeScript (Mainly).
- **State Management**: 
  - **Zustand**: Global application store (`store/useAppStore.js`).
  - **React Context**: Feature-specific state (Auth, Game, Flock, etc.).
- **Icons**: Lucide React / Lucide React Native.

## 🗺️ Workspace Structure
```text
src/frontend/
├── src/
│   ├── components/       # Shared UI components (GlassCard, WeatherBackground)
│   ├── context/          # State providers (Auth, Game, etc.)
│   ├── screens/          # Primary feature views (12 screens)
│   ├── services/         # API clients and business logic handlers
│   ├── store/            # Zustand global stores
│   ├── theme/            # Design system (colors, typography)
│   └── types/            # TypeScript definitions
├── App.tsx               # Root component & Navigation state machine
└── index.web.js          # Entry point for Web build
```

## 🔄 Core Patterns

### 1. Navigation State Machine
Instead of a standard router, `App.tsx` manages the visible screen using a `currentTab` state. This provides total control over the view hierarchy and transitions between the `AuthGate` and `GameContent`.

### 2. Authentication Logic
The `AuthContext` uses a `useReducer` to manage the lifecycle of a user session:
- **IDLE/LOADING**: Session restoration from `localStorage`.
- **AUTHENTICATED**: Access to game content.
- **UNAUTHENTICATED**: Redirect to Login/Register screens.

### 3. API Integration
The `apiClient.ts` centralizes all HTTP communication:
- Automatic **JWT injection** via interceptors.
- **Refresh Token** handling (automatic 401 retry).
- Environment-based base URL configuration.

### 4. Visual Philosophy
The UI follows a "Glassmorphism" and "Weather-reactive" design. Components like `WeatherBackground` dynamically adjust the app's look based on real-world conditions fetched from the backend.
