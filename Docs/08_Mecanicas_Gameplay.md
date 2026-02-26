# 08_Mecanicas_Gameplay

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

