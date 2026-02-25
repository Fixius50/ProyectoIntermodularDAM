# **Arquitectura de la app**

# **Idea de la app**

Aplicación móvil híbrida de colección y estrategia en tiempo real. Combina la **exploración física** (Geolocalización tipo Pokémon GO para avistamiento y recolección de recursos) con **batallas estratégicas de cartas** (tipo Magic/Hearthstone) basadas en ornitología real. El sistema incluye un **Marketplace en tiempo real** y funciones sociales avanzadas, soportado por una arquitectura backend **Reactiva y No Bloqueante**.

## **Cómo lo vamos a estar trabajando**

Usaremos el editor Antigravity. En este en los 3 puntos de la zona del chat (arriba) le damos a habilitar los MCPs.

![][image1]

Un Mcp es una forma de darle herramientas externas y configuradas a la IA de internet (hecho por ingenieros de IA) pero en local, de manera que le permite a la IA ser más eficiente a la hora de trabajar (menos tokens). También vamos a usar unas customizaciones, que es como una configuración dedicada para el proyecto con un contexto con el que va a estar trabajando el agente puesto. Previamente necesitaremos tener instalado npx [https://nodejs.org/en/download](https://nodejs.org/en/download).

MCPs:

- Supabase  
- Github

![][image2]

Le damos a instalar; nos pide en algunas el token de supabase, donde se encuentra en el perfil de nuestro usuario (suele proporcionarse mediante un link que te sale).

![][image3]  
![][image4]

Customizaciones: están en el drive. Se pone dándole a “Global” y metiendo ahí el rol de “cerebro.txt”.  
![][image5]![][image6]

## **Jugabilidad**

Va a consistir en que fabriquemos nuestras cartas mediante materiales (como si fueran jaulas) con distintos materiales, formas, y tamaños. Una vez hechas vamos a cazar pájaros, cada uno según con lo que creemos que pueden atraer al pájaro según los datos de la vida real (algunos con comida, otros con sonidos, etc…).

## **1\. El Ciclo de Vida del Jugador (UX Unificada)**

El juego se organiza en un ciclo diario que transforma recursos físicos en logros competitivos:

* **Mañana (Expedición):** Recolección activa de materiales brutos (Madera, Bayas) mediante minijuegos de "Enfoque".  
* **Mediodía (Crafting):** Construcción de la **Estación de Reclamo** en el Taller combinando materiales.  
* **Tarde (Notificación):** El sistema sincroniza datos reales (clima/probabilidad) y atrae a un ave. Tomas la foto y generas la carta.  
* **Noche (Certamen):** Utilizas tus nuevas cartas en la Arena para ganar **Reputación** y materiales de alta calidad (como Metal).

## **2\. Fase de Adquisición: El Taller del Naturalista**

En lugar de comprar sobres, el jugador **construye la oportunidad** de obtener cartas específicas mediante la personalización de "Estaciones de Reclamo".

### **A. Recolección de Materiales**

Se obtienen materiales mediante expediciones pasivas o minijuegos activos:

* **Madera:** Para atraer aves de bosque.  
* **Fibras/Hierbas:** Funcionan como camuflaje; sin ellas, las aves tímidas no se acercarán.  
* **Metal/Restos:** Para estructuras urbanas o resistentes.  
* **Cebos:** Semillas, fruta o insectos que definen la probabilidad de la especie.

### **B. Construcción y Sincronización (Backend Logic)**

El usuario diseña la estación eligiendo **Base** (Madera/Metal), **Tamaño** (Pequeña para gorriones, Grande para rapaces) y **Cebo**. El servidor calcula qué pájaro aparece basándose en:

1. **Estructura:** Atrae familias específicas (ej. Madera $\\rightarrow$ Pájaro Carpintero).  
2. **Cebo:** Define la dieta (ej. Insectos $\\rightarrow$ Insectívoros).  
3. **Clima (API):** Si llueve, aumenta la probabilidad de aves buscando refugio.

**Resultado:** Tras un tiempo, la estación se gasta o pierde durabilidad, obligando a cerrar el ciclo de consumo y construir una nueva.

## **3\. Fase de Batalla: El Certamen ("Magic Simplificado")**

Un duelo 1vs1 por turnos que utiliza un sistema de **Posturas** y gestión de energía.

### **El Tablero y Recursos**

* **Zona de Juego:** 3 huecos para pájaros por jugador.  
* **Mana (Semillas):** Recurso que aumenta progresivamente (Turno 1 \= 1 Semilla, Turno 2 \= 2 Semillas, etc.) para invocar aves más poderosas.  
* **Estructura de Carta:** Incluye el Coste (Semillas), Postura Predilecta y Habilidad Pasiva (ej. "Si llueve, gana \+1 en Vuelo").

### **Confrontación y Duelo de Posturas**

Si un pájaro enfrenta un hueco vacío, otorga **Puntos Directos (Reputación)**. Si enfrenta a otro pájaro, se inicia un **Duelo de Posturas** basado en el Triángulo de Poder:

| Postura | Vence a... | Lógica Narrativa |
| :---- | :---- | :---- |
| **Canto (Rojo)** | Plumaje | El grito asusta a la belleza. |
| **Plumaje (Verde)** | Vuelo | La belleza distrae al movimiento. |
| **Vuelo (Azul)** | Canto | La velocidad escapa del ruido. |

**Resolución del Duelo:**

* **Ganas:** El pájaro rival huye (se elimina de la mesa).  
* **Empatas:** Ambos se quedan "cansados" en el tablero.  
* **Pierdes:** Tu pájaro se retira del combate.

## **4\. Gestión y Progresión**

* **Álbum (Colección):** Las cartas tienen una **Cara A** (Juego/Stats) y una **Cara B** (Educativa con datos científicos y audio real vía Nuthatch API).  
* **Marketplace:** Las cartas crafteadas o repetidas pueden venderse o subastarse en tiempo real utilizando la arquitectura reactiva del servidor (WebFlux \+ Redis).

Para completar el ecosistema de **AVIS**, la dimensión social actúa como el tejido que une la exploración, el crafteo y el combate, fomentando tanto la competitividad en el mercado como la cooperación en el cuidado de las aves.

Aquí tienes la integración del **Módulo Social** con el resto de la jugabilidad:

## **1\. Bandadas (Sindicatos de Naturalistas)**

La interacción principal se organiza a través de grupos de usuarios llamados **Bandadas**.

* **Chat en Tiempo Real:** Comunicación fluida mediante chats privados y de clan, implementados sobre la arquitectura **RSocket** para garantizar baja latencia.  
* **Eventos de Comunidad:** Participación en eventos especiales que son fundamentales para el progreso del grupo.  
* **Estrategia Compartida:** Los rivales pueden ofrecer consejos automáticos tras las batallas; por ejemplo, sugerir buscar especies de montaña si detectan debilidades en tu equipo.

## **2\. Marketplace Reactivo (Trading)**

El sistema permite una economía viva donde los usuarios no dependen del azar, sino del intercambio.

* **Compra y Venta:** Los usuarios pueden vender cartas que han crafteado en el Taller o que tienen repetidas.  
* **Subastas en Tiempo Real:** Sistema de pujas dinámico soportado por **WebFlux**, permitiendo actualizaciones instantáneas sin recargar la app.  
* **Seguridad y Rapidez:** Uso de **Redis** para búsquedas en submilisegundos y **Redisson** para evitar que dos personas compren la misma carta simultáneamente (bloqueos distribuidos).

## **3\. Socialización Cooperativa y Mantenimiento**

La app premia activamente la interacción positiva entre los naturalistas para mejorar la experiencia general.

* **Mantenimiento de Puestos:** Los puestos de avistamiento tienen un tiempo máximo de 18 horas de efectividad.  
* **Bonus por Ayuda:** Si un puesto ajeno queda inhabilitado, cualquier usuario puede limpiarlo o mantenerlo, recibiendo a cambio un **bonus de recompensa**.  
* **Santuarios Visitables:** La filosofía de "Mejorar tu Santuario" se extiende a mostrar tus logros y aves raras a otros miembros de tu Bandada.

## **4\. Integración Técnica Social**

Para que esta experiencia sea fluida, el backend utiliza herramientas avanzadas:

* **Validación de Identidad:** **Spring Security Reactive** con tokens JWT asegura que cada transacción y mensaje sea auténtico y seguro.  
* **Desacoplamiento de Recompensas:** Tras una interacción social o batalla, un gestor de eventos (**RabbitMQ o Kafka**) procesa las recompensas en segundo plano para no interrumpir la navegación del usuario.  
* **Accesibilidad:** Los botones sociales incluyen etiquetas descriptivas (Semantics) para que cualquier persona, independientemente de su nivel técnico, pueda interactuar con la comunidad.

# **Frontend**

\- Funcionalidad simple para que cualquier persona entienda bien ell funcionamiento de la aplicación da igual la edad y el nivel técnico.

**Tecnologías**:

- **React Native**

**BORRADOR**

# **GUÍA DE ESTILO Y UX (Design System)**

**Antes de pintar pantallas, definimos las reglas visuales.**

### **1\. La Metáfora Visual: "El Cuaderno de Campo Vivo"**

**La aplicación debe sentirse como si tuvieras un diario de naturalista en las manos, pero mágico.**

* **Paleta de Colores (Naturaleza Soft):**  
  * ***Primario:*** **Verde Salvia (`#7C9A92`) \- Para acciones principales.**  
  * ***Secundario:*** **Terracota Suave (`#D9A08B`) \- Para alertas o combate.**  
  * ***Fondo:*** **Papel Crema/Hueso (`#FDFBF7`) \- Evita el blanco puro, cansa la vista.**  
  * ***Texto:*** **Gris Carbón (`#2C3E50`) \- Alto contraste pero menos agresivo que el negro.**  
* **Tipografía:**  
  * ***Títulos:*** **Merriweather o Lora (Serif). Elegancia clásica.**  
  * ***Cuerpo/Botones:*** **Nunito o Quicksand (Sans Serif redondeada). Muy amigable y legible.**  
* **Formas:**  
  * **Glassmorphism: Paneles semitransparentes con desenfoque (`blur`) para superponer menús sobre los fondos de naturaleza.**  
  * **Bordes: Todo muy redondeado (`border-radius: 20px`). Nada de esquinas afiladas.**

---

# **📱 ESQUEMA DE PANTALLAS (WIREFRAMES & FLUJO)**

**La navegación se basa en una Barra Inferior (Bottom Bar) persistente con 4 iconos grandes.**

## **1\. PANTALLA: EL SANTUARIO (HOME)**

**Objetivo: Relajación y estado general.**

* **Fondo (Dinámico):**  
  * **Ocupa toda la pantalla. Es una ilustración vectorial (SVG) o Lottie que cambia según la API del tiempo (Lluvia, Sol, Noche).**  
* **Zona Central (El Árbol):**  
  * **Un árbol ilustrado donde se posan aleatoriamente 3-5 pájaros de tu colección.**  
  * ***Interacción:*** **Si tocas un pájaro, hace su sonido (Audio) y suelta una pequeña animación de corazones.**  
* **Panel Superior (Resumen):**  
  * **Pequeña tarjeta de cristal: "🌤️ Madrid: Despejado | 🌡️ 18ºC".**  
  * **Contador de recursos: "🌰 Semillas: 150".**

## **2\. PANTALLA: EXPEDICIÓN (Juego Pasivo/Activo)**

**Objetivo: Conseguir "Fotos" (Material base).**

* **Selector de Bioma (Carrusel):**  
  * **Deslizar izquierda/derecha para elegir: Bosque, Costa, Montaña.**  
  * ***Indicador Visual:*** **Si llueve en el juego, el icono del Bosque tiene gotitas.**  
* **Estado A: Iniciar Expedición**  
  * **Botón grande "Enviar Observador".**  
  * **Selector de Cebo (Iconos grandes: Gusano, Fruta, Pez).**  
* **Estado B: Esperando (El Minijuego)**  
  * **Mientras corre el tiempo (ej: 01:59:00), aparece un botón vibrante: "Realizar Avistamiento Rápido".**  
  * **Overlay del Minijuego "Enfoque":**  
    * **Fondo: Una foto de Pexels muy borrosa.**  
    * **Control: Un slider horizontal en la parte baja.**  
    * **Acción: Mover el slider hasta que la foto esté nítida. Al soltar en el punto exacto \-\> ¡Flash\! \-\> Ganas "Notas de Campo".**

## **3\. PANTALLA: TALLER (CRAFTING)**

**Objetivo: Crear las cartas finales.**

* **Diseño: Parece una mesa de madera de escritorio.**  
* **Zona de Drop (El Tapete):**  
  * **Tres huecos vacíos con formas: \[Foto\] \+ \[Pluma\] \+ \[Notas\].**  
* **Inventario Inferior:**  
  * **Lista horizontal arrastrable con tus objetos conseguidos en expediciones.**  
* **Feedback:**  
  * **Al arrastrar los 3 objetos correctos, el centro brilla.**  
  * **Botón "Registrar Ave" se activa.**  
  * **Animación de Recompensa: La carta aparece en blanco, se dibuja el contorno y luego se rellena de color (efecto acuarela).**

## **4\. PANTALLA: CERTAMEN (BATALLA)**

**Objetivo: Competir (Piedra-Papel-Tijera Estratégico).**

* **Layout Dividido:**  
  * **Arriba: Pájaro del Rival (Avatar \+ Nombre).**  
  * **Abajo: Tu Pájaro (Avatar \+ Stats).**  
* **Zona Central (La Acción):**  
  * **3 Botones Circulares Grandes (Iconos):**  
    1. **🎤 Canto (Rojo)**  
    2. **💨 Vuelo (Azul)**  
    3. **🪶 Plumaje (Verde)**  
* **Indicadores de Ayuda (Accesibilidad):**  
  * **Flechas pequeñas entre los botones que indican quién gana a quién (Canto \> Plumaje).**  
* **El Factor Clima:**  
  * **Si hay VIENTO (API), el botón de Vuelo tiene un icono de "Prohibido" o un candado semitransparente que indica "Cuesta más energía".**

## **5\. PANTALLA: EL ÁLBUM (COLECCIÓN)**

**Objetivo: Gestión y Consulta.**

* **Vista de Rejilla: Cards rectangulares verticales.**  
* **Filtros: Pestañas simples: "Todos", "Agua", "Bosque".**  
* **Detalle de Carta (Modal a pantalla completa):**  
  * **Cara A (Juego): Foto grande, Nombre Común, Iconos de Stats (1-10).**  
  * **Botón Girar: Icono de flecha en la esquina.**  
  * **Cara B (Educativa): Fondo estilo papel antiguo. Nombre científico, Mapa de distribución, Texto de curiosidad, Botón de "Escuchar Canto".**

---

# **🛠️ COMPONENTES TÉCNICOS (FLUTTER/REACT)**

**Para programar esto ordenadamente en el Frontend:**

### **A. Widgets Reutilizables (Components)**

1. **`WeatherBackground`: Un componente que recibe el estado del clima ("RAIN", "SUN") y renderiza el fondo animado correspondiente.**  
2. **`BirdCard`: El componente visual de la carta. Debe aceptar parámetros para mostrarse en "Modo Mini" (Inventario) o "Modo Full" (Álbum).**  
3. **`ResourceCounter`: Pill (pastilla) visual con icono y número animado.**

### **B. Gestión de Estado (Logic)**

**Necesitamos un gestor de estado global (Provider, Bloc o Riverpod en Flutter).**

* **`WeatherProvider`: Consulta a tu Backend al abrir la app y guarda el clima. Todos los componentes se suscriben a esto para saber si "llueve".**  
* **`UserProvider`: Guarda las monedas (Semillas, Notas) y el Inventario.**

### **C. Accesibilidad (El Toque Profesional)**

* **Semantics (Flutter): Etiquetar cada botón para lectores de pantalla.**  
  * ***Mal:*** **Botón con icono de micrófono.**  
  * ***Bien:*** **Etiqueta "Usar Canto. Fuerte contra Plumaje".**  
* **Haptic Feedback: Vibración suave del móvil cuando:**  
  * **Enfocas bien la foto en el minijuego.**  
  * **Ganas una ronda en el Certamen.**

---

# **💡 DETALLE DE "JUGABILIDAD INTERCONECTADA" EN LA UI**

**¿Cómo le mostramos al usuario que todo está conectado? Con Pistas Visuales.**

1. **En la Expedición:**  
   * **Si tienes "Notas de Campo" (conseguidas en el minijuego), el botón de "Enviar Expedición" brilla en dorado, indicando que tendrás más suerte.**  
2. **En el Taller:**  
   * **Si te falta una "Pluma" para completar un pájaro, al pulsar el hueco vacío, sale un popup: *"¡Gana certámenes para conseguir plumas\!"*. (Te redirige al juego).**  
3. **En el Certamen:**  
   * **Si pierdes una batalla, el rival te dice: *"Tu pájaro es lento. Busca especies de Montaña en las Expediciones"*.**

     **TERMINA BORRADOR** 

---

# **Backend**

APIS RECOMENDADAS POR EL PROFE 

APIs útiles para el proyecto de DAM  
Unsplash API y Pexels API son opciones populares para descargar fotos gratuitas de alta  
calidad mediante solicitudes programáticas.  
Unsplash API  
Proporciona acceso a millones de imágenes gratuitas para uso comercial sin atribución  
obligatoria. Regístrate en unsplash.com/developers para obtener una clave API  
gratuita, con límites iniciales de 50 solicitudes por hora (ampliables). Usa endpoints  
como /photos/random para fotos aleatorias o /search/photos para búsquedas  
específicas.  
Pexels API  
Ofrece fotos y videos gratuitos con licencia CC0, ideal para proyectos web. Crea una  
cuenta en pexels.com/api para tu clave API gratuita (200 solicitudes por hora, 20,000  
mensuales). Endpoints clave incluyen /v1/photos/popular y /v1/search para curación y  
búsquedas.  
Otras alternativas simples  
Lorem Picsum: API sin registro para imágenes placeholder aleatorias (ej.  
https://picsum.photos/800/600), perfecta para pruebas rápidas sin límites estrictos.  
Pixabay API: Miles de fotos gratuitas con clave gratuita, soporta búsquedas por  
categoría y alta resolución.  
Nuthatch API — Es una API gratuita orientada a aves; su catálogo incluye fotos  
(compiladas con imágenes de fuentes libres como Unsplash \+ contribuciones privadas).  
Vecteezy API — Permite acceder a una biblioteca enorme de fotos, vectores y recursos  
gráficos; útil si no necesitas fotos específicamente ornitológicas, pero sí imágenes  
"libres" de aves o naturaleza.

### **APIs Externas (Gestión de Recursos)**

* **Nuthatch API:** Fuente de verdad para datos taxonómicos (nombre científico, familia).  
* **Unsplash / Pexels API:** Fondos de cartas (hábitats) y eventos.  
* **Vecteezy:** Iconografía vectorial para la UI (plumas, nidos, ataque).

## **Alojamiento de Datos**

Supabase con JSON  
SQLite en local

## **Manejo de Datos (Java \+ Spring Framework)**

Se centrará en usar Java \+ Spring para el manejo de los datos y la información.

Aquí tienes el diagrama conceptual de lo que vamos a construir, seguido de la tabla definitiva que resume tu **Stack Reactivo y Asíncrono**.

### **El Stack 100% Asíncrono (WebFlux / Reactor)**

| Módulo / Tecnología | ¿Por qué lo usamos? (La Ventaja) | ¿Cómo se implementa? (La Práctica) |
| ----- | ----- | ----- |
| **Spring WebFlux**  *(Servidor Netty)* | Es el motor central no bloqueante. Permite que un solo servidor maneje miles de partidas a la vez sin quedarse sin memoria RAM. | Se usa en lugar de Spring MVC (Tomcat). En tu código Java, en vez de devolver Carta, devuelves Mono\<Carta\> o Flux\<Carta\>. |
| **RSocket**  *(Comunicación)* | Protocolo bidireccional más rápido que WebSockets. Soporta *Backpressure*: si el móvil va lento, ajusta el envío de datos para no colgar la app React. | Se habilita con spring-boot-starter-rsocket. Usas la anotación @MessageMapping para escuchar los movimientos (ej: "Atacar") del cliente. |
| **Spring Data R2DBC**  *(Conexión DB)* | Es el driver asíncrono para PostgreSQL (Supabase). Evita que el servidor se quede "congelado" esperando a que la base de datos lea el inventario. | Reemplaza a Hibernate/JPA. Creas repositorios reactivos (ReactiveCrudRepository) que devuelven Mono/Flux al interactuar con las tablas. |
| **Spring Data Redis Reactive**  *(Caché Marketplace)* | Para el Marketplace, consultar Supabase por cada búsqueda saturaría la red. Redis mantiene el catálogo en RAM para respuestas en submilisegundos. | Usas ReactiveRedisTemplate para guardar y leer las ofertas activas sin bloquear el hilo principal. |
| **Redisson**  *(Distributed Locks)* | Evita el "doble gasto" o clonación de cartas en el Marketplace. Bloquea una carta a nivel de red entera si dos personas la compran a la vez. | Cuando un usuario le da a "Comprar", pides un lock (RLockReactive) a Redisson por el ID de la carta. Nadie más puede tocarla hasta que se libere. |
| **Spring Security Reactive**  *(Auth)* | Valida que el usuario sea quien dice ser sin frenar el flujo de datos. Se integra directamente con el sistema Auth de Supabase. | Configuras un ReactiveJwtDecoder que verifica la firma del token enviado desde la WebView y guarda el usuario en el ReactiveSecurityContext. |
| **Spring Kafka** o **RabbitMQ**  *(Event Broker)* | Saca el trabajo pesado fuera de la partida. (Ej: Repartir experiencia, guardar logs, dar recompensas al acabar un duelo). | Al acabar la partida, emites un evento PartidaTerminada. El hilo del jugador queda libre al instante, y otro microservicio procesa las recompensas. |

### **Las Alternativas (El "Plan B")**

Si durante el desarrollo veis que el modelo reactivo (Mono / Flux) hace que el código sea muy difícil de leer o testear, estas son las alternativas que sacrifican un poco de rendimiento puro por **facilidad de desarrollo**:

* **Alternativa a WebFlux (Motor): *Spring Web MVC \+ Virtual Threads (Java 21+).***  
  * *Por qué:* Te permite escribir código tradicional paso a paso (síncrono y fácil de leer) pero con casi el mismo rendimiento masivo que WebFlux gracias a los hilos virtuales de Java.  
* **Alternativa a RSocket (Comunicación): *WebSockets Clásicos (STOMP).***  
  * *Por qué:* Es mucho más fácil de integrar con React y la WebView. Hay decenas de librerías listas para usar (como sockjs-client), mientras que RSocket requiere un poco más de configuración en el frontend.  
* **Alternativa a R2DBC (Base de datos): *Spring Data JPA (Hibernate) \+ Hypersistence Utils.***  
  * *Por qué:*jpa JPA/Hibernate te hace toda la "magia" de convertir las tablas en objetos Java con simples anotaciones, a costa de usar operaciones bloqueantes.  
* **Alternativa a Kafka/Redis (Mercado simple): *Optimistic Locking en PostgreSQL.***  
  * *Por qué:* Si no quieres pagar/mantener servidores extra de Redis o Kafka, puedes usar un simple campo @Version en Supabase. Si hay un conflicto de compra, la base de datos lanza una excepción, se cancela todo, y le muestras un error de "Carta ya vendida" al usuario.

### **Backend (Lo que usaremos)**

* **Framework Core:** Spring Boot 3 (WebFlux).  
* **Motor Asíncrono:** Project Reactor (Mono/Flux).  
* **Comunicación Cliente-Servidor:** **RSocket** (para el juego en tiempo real) \+ REST (para configuración inicial).  
* **Persistencia:** Spring Data R2DBC (Reactivo).  
* **Base de Datos:** **Supabase (PostgreSQL)**. Uso de modelo puramente relacional y `PostGIS` (si Supabase lo permite, o coordenadas simples) para la geolocalización.  
* **Networking (Multijugador):** **Tailscale**. Se utilizará para crear una red segura entre jugadores y el servidor, permitiendo tráfico RSocket directo sin exposición pública de puertos. El servidor escuchará en `0.0.0.0` y los clientes se conectarán a la IP de Tailscale del servidor.
* **Caché & Locks:** **Redis Reactive** (con Redisson para bloqueos distribuidos en el Marketplace).  
* **Event Broker:** RabbitMQ o Kafka (para desacoplar la lógica de recompensas post-partida).  
* **Seguridad:** Spring Security Reactive \+ JWT (validando contra Supabase Auth).

## **Implementación en el server**

Comandos Server:

    2  sudo apt update && sudo apt upgrade \-y

    3  sudo apt install python-is-python3 \-y

    4  sudo apt install python3 python3-pip python3-venv \-y

    5  python3 \--version

    6  pip3 \--version

    7  sudo apt install curl \-y

    8  curl \-o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

    9  source \~/.bashrc

   10  nvm install node

   11  sudo apt install openjdk-21-jdk \-y

   12  sudo apt install docker.io docker-compose \-y

   13  sudo usermod \-aG docker $USER

   14  sudo usermod \-aG docker $lubuntu

   15  sudo apt install maven \-y

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,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UeMf/vCHxblz56blr3/966dyf/nLXybf/e53Fy984Qt3wsIDDzwwtaePKRV8tO5FL3rR4uGHH57q0vJHH3106pee8Hz605+e6tfHa4888sjixIkT003/oYcemsrLV77ylSkQ+Ljk5S9/+fSx4Qc+8IHFmTNnpnbf+MY37qx/xSteMfVBdahvd99999SmfuoJmPry4x//eOqft1ntqY8/+clPdsZ6xx13TONRMKmxXLhwYVe/pBW09BGu+qixqj+f//znF895znOeFrRUv9r8xje+Ma3TGDR3al9lPvvZzy6e9axn7ewf/dQ6PdW79dZbd/VDesFJY9TTrJzbXnkAAK5Wawcteetb3zoFLQ8/GazyvX7qxq6yCh4KJgoxL37xi6enY7rZ68ZeIazCwg9/+MMpAN1+++3TNgpeupEr5Ck4vOpVr5rChkKGttfHmgow1VcFIQWeCgBq69e//vXiE5/4xK5xaTt9PKfvaamfel3ltK36olCnj/EUxhTq9FGj+qnX2k4f7alP1aa3p/c/+tGPFsePH99pU/3W990UgLI/LoPWbbfdNs3VF7/4xSlMas70Xu3U3H3sYx+bApaClsajMfzgBz9Y3H///dN8awy/+93vplCp/VNz/+Y3v3kKnOpv9kNawUn7Qm31tgEA4DC5rKAlulErZCj8KGy95CUvWRq0FDL0WkFA2+mnnvx86UtfmsKSnuro6YyexLQ+/lIdopu6go3CgMrUPy9w6tSpnS+y33PPPVPdCml6OpNfJs+goECmurPc97///enjw1tuuWUKJRpzlVeI0keNGpe+S6Xl+v6UQmC2qfY+9alPTb+Bp3ZURnWovieffHJ6Evb+979/mlfvV8mgVQHtpS996fRefVRfVXfNneZC8/qGN7xhKqMgWvPlNMfazr9gX/urxuVaQUte9rKX7XqaBQDAYXTZQat88pOfnILN2972tunGPBe0FAT0+r3vfe9O0PrqV786PSVSSFJIqS+hZ9BSKNHHiqpH/yaTnhIp/GQAUbhSnxQwFDTe9773TaFHwcz7nfQbhtrm4x//+NQPUdva9k1vetMUUhS09BTIt9MTnApjtazCXbapMShgaRuFSgUvLX/ta187PeXTeDUfrS+55zgVtDQ+PUXT+wpaqrvmTuX1lEpzoDIag75fV2HRtYKWv3e9oNWz1/IAAGy7tYPWhz70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>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,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>

[image6]: <data:image/png;base64,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>

---

5. Infraestructura de Red: VPN Peer-to-Peer (Tailscale)
Para garantizar que los dispositivos móviles (Android) puedan comunicarse de manera segura y directa con el servidor local (Lubuntu) durante las fases de desarrollo y la presentación final del TFG, se ha implementado una red virtual privada basada en WireGuard mediante Tailscale.

5.1. Justificación Arquitectónica
El uso de esta Tailnet resuelve dos problemas críticos del proyecto:

Evasión de NAT/Firewalls: Permite esquivar las restricciones de red, puertos cerrados y aislamiento de clientes típicos de las redes Wi-Fi institucionales (institutos/universidades).

Seguridad del Modelo de IA: Mantiene el procesamiento de los modelos locales pesados (.gguf) aislado y seguro dentro del servidor Lubuntu, exponiendo únicamente los endpoints necesarios a través del túnel cifrado.

5.2. Script de Autoconfiguración y Despliegue (auth_tailscale.sh)
Para automatizar el alta del servidor en la red virtual, se ha creado un script Bash en la ruta /home/lubuntu/auth_tailscale.sh que utiliza una Auth Key estática.

Código del script:

Bash
#!/bin/bash

# ==========================================
# Script de Autenticación y Autoarranque de Tailscale
# Proyecto AVIS - TFG
# ==========================================

# Clave de autorización del proyecto (Precaución: No exponer en repositorios públicos)
TAILSCALE_AUTH_KEY="tskey-auth-k4cntXLUiW11CNTRL-ZriLhcmNRY6WHVTap15NZ6ygQTDoJY4o"

echo "Autenticando el servidor en la Tailnet de AVIS..."

# 1. Levantar Tailscale usando la Auth Key de forma desatendida
sudo tailscale up --authkey=${TAILSCALE_AUTH_KEY}

# 2. Habilitar el demonio en systemd
sudo systemctl enable --now tailscaled

echo "=========================================="
echo "✅ Tailscale autenticado y configurado con éxito."
echo "La IP virtual estática del servidor backend es:"
tailscale ip -4
echo "=========================================="
Permisos de ejecución:

Bash
chmod +x /home/lubuntu/auth_tailscale.sh
5.3. Resiliencia y Autoarranque (Crontab)
Para que el servidor sea el gestor autónomo del flujo del juego, debe ser tolerante a caídas de red o cortes de energía. Se ha configurado el programador de tareas del sistema (cron) para ejecutar el script de conexión automáticamente en cada inicio, antes de que el usuario inicie sesión.

Configuración en el servidor (Lubuntu):

Abrir el editor de tareas del superusuario:

Bash
sudo crontab -e
Añadir la directiva de ejecución al final del archivo:

Bash
@reboot /home/lubuntu/auth_tailscale.sh
Esto garantiza que, tras cualquier reinicio físico, el túnel VPN se levante en segundo plano al instante, manteniendo la misma IP virtual asignada (100.x.x.x).

5.4. Configuración en Dispositivos Cliente (Android)
Para que los jugadores puedan acceder al juego:

Instalar la aplicación oficial de Tailscale desde Google Play.

Iniciar sesión con la cuenta de administración del proyecto.

Activar el interruptor de conexión VPN en la app.

El dispositivo Android se conectará instantáneamente a la misma red de área local virtual (VLAN) que el servidor Lubuntu.

5.5. Integración en el Frontend
Dentro del código de la aplicación móvil (React Native/Flutter), las variables de entorno apuntan directamente a la IP estática del túnel Tailscale en lugar de a localhost:

JavaScript
// Configuración de red para el cliente Android
const SERVER_IP = "100.x.x.x"; // Sustituir por la IP asignada a Lubuntu 100.112.239.82
const API_REST_URL = `http://${SERVER_IP}:8080/api`;
const RSOCKET_URL = `ws://${SERVER_IP}:7000/rsocket`;


---

1. Stack Tecnológico del Proyecto (Backend)
El sistema está diseñado para soportar alta concurrencia y baja latencia mediante un enfoque 100% reactivo:

Framework Core: Java 21 con Spring Boot 3 (WebFlux / Reactor).

Comunicación en Tiempo Real: RSocket.

Base de Datos Principal: Supabase (PostgreSQL con uso de estructura relacional mediante Spring Data R2DBC).

Caché y Marketplace: Redis Reactive con bloqueos distribuidos (Redisson).

Procesamiento de Eventos: Kafka / RabbitMQ.

2. Preparación del Entorno de Desarrollo (Lubuntu)
Para desarrollar el servidor backend y ejecutar las herramientas del equipo, es necesario instalar las siguientes dependencias base en el sistema operativo:

2.1. Herramientas Base, Python y Node.js
Bash
# Actualizar repositorios del sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python 3 y su entorno gráfico (necesario para las herramientas internas)
sudo apt install python3 python3-pip python3-venv python3-tk -y

# Instalar Node.js y npm (para los MCPs del editor Antigravity)
sudo apt install nodejs npm -y
2.2. Ecosistema Java y Contenedores
Bash
# Instalar Java 21 (JDK requerido por Spring Boot 3) y Maven
sudo apt install openjdk-21-jdk maven -y

# Instalar Docker para levantar Redis y RabbitMQ/Kafka en local
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER # Requiere reiniciar la sesión del sistema
2.3. Control de Versiones y Git LFS
Bash
# Instalar Git y Git LFS (Large File Storage)
sudo apt install git git-lfs -y
git lfs install
3. Configuración del Repositorio Oficial y Credenciales
Para interactuar con el repositorio oficial sin bloqueos de autenticación, es necesario guardar un Personal Access Token (PAT) a nivel de sistema.

Bash
# 1. Clonar el repositorio en el directorio personal
cd ~
git clone https://github.com/Fixius50/ProyectoIntermodularDAM.git

# 2. Configurar Git para recordar las credenciales de forma global
git config --global credential.helper store

# 3. Realizar un push manual para registrar el token por primera vez
cd ~/ProyectoIntermodularDAM
git push
# (Al solicitar credenciales, introducir el usuario 'Fixius50' y el Personal Access Token).
4. Herramienta Interna: AVIS Dev Uploader (Pro Edition)
Para agilizar el flujo de trabajo del equipo, se ha desarrollado una aplicación de escritorio (GUI) en Python. Su objetivo es subir archivos al repositorio oficial esquivando el límite de 100MB de GitHub. La aplicación detecta extensiones configuradas (como .gguf, .psd, .mp4) y ejecuta automáticamente git lfs track antes del commit.

4.1. Instalación de la Herramienta
Se despliega en un entorno virtual aislado:

Bash
mkdir ~/avis-dev-tools
cd ~/avis-dev-tools
python3 -m venv venv
source venv/bin/activate
python -m pip install customtkinter GitPython
4.2. Código Fuente (app.py)
Dentro de la carpeta ~/avis-dev-tools, crear el archivo app.py con el siguiente código base:

Python
import customtkinter as ctk
import tkinter.filedialog as fd
import os
import shutil
import threading
from git import Repo
import subprocess

# Configuración visual
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# Extensiones configuradas para Git LFS automático
LFS_EXTENSIONS = ['.gguf', '.psd', '.mp4', '.zip', '.tar.gz', '.bin', '.png', '.jpg']

class AvisUltimateUploader(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("AVIS Dev Uploader - Pro Edition")
        self.geometry("700x650")
        
        # Apunta automáticamente al repositorio oficial clonado
        self.repo_path = ctk.StringVar(value=os.path.expanduser("~/ProyectoIntermodularDAM"))
        self.selected_files = []

        # Interfaz - Sección Superior
        self.frame_top = ctk.CTkFrame(self)
        self.frame_top.pack(pady=10, padx=20, fill="x")

        self.lbl_repo = ctk.CTkLabel(self.frame_top, text="Ruta del Repositorio Local:", font=("Roboto", 14, "bold"))
        self.lbl_repo.pack(anchor="w", padx=10, pady=(10, 0))
        
        self.entry_repo = ctk.CTkEntry(self.frame_top, textvariable=self.repo_path, width=500)
        self.entry_repo.pack(side="left", padx=10, pady=10)
        
        self.btn_repo = ctk.CTkButton(self.frame_top, text="Cambiar Repo", command=self.select_repo, width=100)
        self.btn_repo.pack(side="left", padx=10, pady=10)

        # Interfaz - Sección Media
        self.frame_mid = ctk.CTkFrame(self)
        self.frame_mid.pack(pady=10, padx=20, fill="x")

        self.btn_select = ctk.CTkButton(self.frame_mid, text="1. Seleccionar Archivos a Subir", command=self.select_files)
        self.btn_select.pack(pady=10)

        self.files_label = ctk.CTkLabel(self.frame_mid, text="0 archivos seleccionados", text_color="gray")
        self.files_label.pack(pady=5)

        self.commit_msg = ctk.CTkEntry(self.frame_mid, placeholder_text="2. Escribe el mensaje del commit...", width=500)
        self.commit_msg.pack(pady=15)

        self.btn_upload = ctk.CTkButton(self.frame_mid, text="3. Sincronizar y Subir a GitHub", command=self.start_upload_thread, fg_color="#10b981", hover_color="#059669", font=("Roboto", 14, "bold"))
        self.btn_upload.pack(pady=10)

        # Interfaz - Consola de Logs
        self.lbl_log = ctk.CTkLabel(self, text="Terminal de Operaciones:", font=("Roboto", 12, "bold"))
        self.lbl_log.pack(anchor="w", padx=20)

        self.log_console = ctk.CTkTextbox(self, width=660, height=200, state="disabled", fg_color="#1e1e1e", text_color="#00ff00")
        self.log_console.pack(pady=5, padx=20)

    def log(self, message):
        self.log_console.configure(state="normal")
        self.log_console.insert("end", f"> {message}\n")
        self.log_console.see("end")
        self.log_console.configure(state="disabled")

    def select_repo(self):
        directorio = fd.askdirectory(title="Selecciona la carpeta raíz del repositorio Git")
        if directorio:
            self.repo_path.set(directorio)
            self.log(f"Repositorio fijado en: {directorio}")

    def select_files(self):
        archivos = fd.askopenfilenames(title="Elige los archivos para añadir al proyecto")
        if archivos:
            self.selected_files = list(archivos)
            self.files_label.configure(text=f"{len(archivos)} archivo(s) listo(s) para copiar y subir", text_color="white")
            self.log(f"Se han seleccionado {len(archivos)} archivos.")

    def start_upload_thread(self):
        if not self.selected_files:
            self.log("ERROR: No has seleccionado ningún archivo.")
            return
        if not self.commit_msg.get():
            self.log("ERROR: El mensaje de commit no puede estar vacío.")
            return
        
        self.btn_upload.configure(state="disabled", text="Subiendo...")
        hilo = threading.Thread(target=self.process_and_upload)
        hilo.start()

    def process_and_upload(self):
        repo_dir = self.repo_path.get()
        mensaje = self.commit_msg.get()

        try:
            self.log("Verificando repositorio Git...")
            repo = Repo(repo_dir)
            
            self.log("Copiando archivos al espacio de trabajo...")
            for filepath in self.selected_files:
                filename = os.path.basename(filepath)
                destino = os.path.join(repo_dir, filename)
                
                if filepath != destino:
                    shutil.copy2(filepath, destino)
                    self.log(f"Copiado: {filename}")

                # Auto-configuración de Git LFS para archivos masivos
                ext = os.path.splitext(filename)[1].lower()
                if ext in LFS_EXTENSIONS:
                    self.log(f"Extensión pesada detectada ({ext}). Configurando Git LFS...")
                    subprocess.run(["git", "lfs", "track", f"*{ext}"], cwd=repo_dir, check=True, capture_output=True)
                    repo.git.add(".gitattributes")

            self.log("Añadiendo archivos al índice (git add)...")
            repo.git.add(all=True)

            self.log(f"Creando commit: '{mensaje}'...")
            repo.index.commit(mensaje)

            self.log("Enviando datos a GitHub (git push)... Esto puede tardar.")
            origen = repo.remote(name='origin')
            info_push = origen.push()
            
            for info in info_push:
                self.log(f"Resultado Push: {info.summary}")

            self.log("✅ ¡SUBIDA COMPLETADA CON ÉXITO!")
            
            self.selected_files = []
            self.files_label.configure(text="0 archivos seleccionados", text_color="gray")
            self.commit_msg.delete(0, 'end')

        except Exception as e:
            self.log(f"❌ ERROR CRÍTICO: {str(e)}")
        
        finally:
            self.btn_upload.configure(state="normal", text="3. Sincronizar y Subir a GitHub")

if __name__ == "__main__":
    app = AvisUltimateUploader()
    app.mainloop()
4.3. Acceso Directo de Escritorio (Lanzador)
Para ejecutar la aplicación nativamente en el entorno de escritorio de Lubuntu sin abrir la terminal:

Crear el archivo .desktop:

Bash
cd $(xdg-user-dir DESKTOP)
nano AVIS_Uploader.desktop
Insertar la configuración:

Ini, TOML
[Desktop Entry]
Version=1.0
Type=Application
Name=AVIS Dev Uploader
Comment=Herramienta interna para subir archivos masivos a GitHub
Exec=bash -c "cd ~/avis-dev-tools && source venv/bin/activate && python app.py"
Icon=utilities-terminal
Terminal=false
Categories=Development;
Otorgar permisos de ejecución:

Bash
chmod +x AVIS_Uploader.desktop


---

# ProyectoIntermodularDAM

---

7. Base de Datos (Supabase) y Persistencia Reactiva
Para el almacenamiento de datos persistentes y multimedia del juego, se utiliza Supabase (PostgreSQL). La arquitectura de la base de datos está diseñada para soportar las mecánicas principales de un TCG con geolocalización: gestión de usuarios, catálogo de cartas (estadísticas de los pájaros) y el inventario posicional.

7.1. Esquema Relacional (SQL)
Se ha implementado el siguiente esquema de datos directamente en el clúster de PostgreSQL de Supabase. El uso de UUID como clave primaria previene la enumeración de recursos y mejora la seguridad de la API.

SQL
-- 1. Tabla de Jugadores (Perfiles de usuario)
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla Catálogo: Estadísticas base de las cartas (Pájaros)
CREATE TABLE bird_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,      
    health INT NOT NULL DEFAULT 0,          
    attack_damage INT NOT NULL DEFAULT 0,   
    defense INT NOT NULL DEFAULT 0,         
    type VARCHAR(50),                       
    luck INT NOT NULL DEFAULT 0,            
    speed INT NOT NULL DEFAULT 0,           
    image_url TEXT,                         
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla Inventario: Relación N:M entre Jugador y Carta (con tracking GPS)
CREATE TABLE player_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    bird_card_id UUID REFERENCES bird_cards(id) ON DELETE CASCADE,
    captured_lat DOUBLE PRECISION,          
    captured_lon DOUBLE PRECISION,          
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
7.2. Almacenamiento Multimedia (Supabase Storage)
Para servir los assets gráficos (las imágenes de las cartas) a los dispositivos móviles sin sobrecargar el servidor backend, se ha configurado un Bucket público en Supabase Storage llamado bird-images. Los enlaces absolutos a estos recursos se almacenan en la columna image_url de la tabla bird_cards.

7.3. Mapeo Objeto-Relacional en Spring Boot (Entities)
Para que el backend interactúe con las tablas de forma asíncrona, se ha utilizado Spring Data R2DBC. Se han generado las clases de modelo (Entities) en el paquete com.avis.server.model, utilizando Lombok para automatizar la generación de constructores, getters y setters, manteniendo un código limpio.

Ejemplo del Modelo Principal: BirdCard.java

Java
package com.avis.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table("bird_cards")
public class BirdCard {
    
    @Id
    private UUID id;
    
    private String name;
    private Integer health;
    private Integer attackDamage; // Mapeado automáticamente a attack_damage en SQL
    private Integer defense;
    private String type;
    private Integer luck;
    private Integer speed;
    private String imageUrl;
    
    private Instant createdAt;
}
(Se han implementado de forma análoga las clases Player.java y PlayerInventory.java para reflejar sus respectivas tablas).

7.4. Capa de Acceso a Datos (R2DBC Repositories)
La persistencia se gestiona de forma 100% no bloqueante gracias a las interfaces R2dbcRepository. Spring Boot genera en tiempo de ejecución las consultas SQL subyacentes, devolviendo tipos de datos reactivos (Mono y Flux de Project Reactor).

Archivo de configuración (src/main/java/com/avis/server/repository/GameRepositories.java):

Java
package com.avis.server.repository;

import com.avis.server.model.BirdCard;
import com.avis.server.model.Player;
import com.avis.server.model.PlayerInventory;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import java.util.UUID;

public interface GameRepositories {

    // Repositorio reactivo para el catálogo de cartas
    interface BirdCardRepository extends R2dbcRepository<BirdCard, UUID> {}

    // Repositorio reactivo para la gestión de usuarios
    interface PlayerRepository extends R2dbcRepository<Player, UUID> {}

    // Repositorio reactivo para inventario y geolocalización
    interface PlayerInventoryRepository extends R2dbcRepository<PlayerInventory, UUID> {}

}


---


