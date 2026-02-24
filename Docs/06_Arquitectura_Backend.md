# 06. Arquitectura Funcional del Backend (Java/Spring Boot)

Este documento no es solo una hoja de ruta, es la **Autopsia Técnica** del servidor "AVIS". Analiza en profundidad qué hace Java bajo el capó, cómo operan los hilos (threads) interactuando con el framework Spring Boot 3, y una equivalencia metafórica de cómo este diseño se trasladaría al mundo real.

---

## 🏗️ 1. Filosofía de la Arquitectura: Asincronía Pura (Non-Blocking)

El problema de las APIs REST tradicionales (Bloqueantes) es que por cada usuario que pide datos, Java abre un "Hilo" (`Thread`) que se queda quieto (bloqueado) esperando a que la Base de Datos responda. Si hay 10,000 usuarios esperando a que cargue su inventario, el servidor necesita 10,000 hilos de RAM, lo que colapsaría (Out of Memory) un servidor estándar.

### ¿Qué hace Java WebFlux aquí?

Hemos usado **Spring WebFlux (Project Reactor)**. En lugar de un hilo por petición, delegamos el tráfico en el servidor **Netty**. Netty corre sobre unos poquitos hilos (Event Loop). Cuando un usuario pide su inventario, Netty encola la tarea, la lanza a la BD y, en lugar de esperar bloqueado, **se va a atender a otros clientes**. Cuando la BD responde, lanza una señal (Evento) para que Netty retome al usuario original y le devuelva los datos.

* **Flujo Reactivo (`Mono` / `Flux`):** Java no devuelve `Objetos`, devuelve "promesas" o "tuberías" que escupirán 1 elemento (`Mono`) o Varios (`Flux`) cuando estén listos.

> 🏢 **Equivalencia en el Mundo Real:**
> Un servidor tradicional es un restaurante donde **un camarero atiende una única mesa**, va a cocina, pide el plato, y **se queda mirando al cocinero** de brazos cruzados hasta que la comida sale. El restaurante colapsa con 5 mesas.
> **Nuestra arquitectura Reactiva:** El camarero (Hilo/Netty) toma nota, pega la comanda en cocina, y se va inmediatamente a atender a 100 mesas más. Cuando el cocinero (Base de datos) toca la campana, el camarero coge el plato y lo lleva en cuanto está libre. Un solo camarero atiende cientos de mesas sin sudar.

---

## 🕊️ 2. Módulo de Catálogo: Consumo REST Server-to-Server

La aplicación no almacena las miles de aves existentes en su disco duro.

* **Técnica:** El `BirdCatalogService` utiliza **Spring WebClient**, un cliente HTTP Reactivo. En tiempo de ejecución, se lanza una petición de red asíncrona hacia una nube pública (una URL que sirve un `JSONVacio.JSON`).
* **Bajo el Capó:** Java usa la librería Jackson interna de Spring para des-serializar (traducir) miles de corchetes e hilos de texto JSON crudo transformándolos en milisegundos a Listas de Objetos Java (`Flux<BirdRecord>`).

> 🏢 **Equivalencia en la Vida Real:**
> En lugar de imprimir todos los libros del mundo y guardarlos en una estantería en nuestra sede (Base de Datos Local Gigante), somos una biblioteca virtual que, cada vez que alguien pregunta por un libro, hace una llamada secreta ultrarrápida a la Biblioteca Central de Washington (La nube), nos leen el libro por teléfono super rápido (Deserialización Jackson) y se lo contamos al usuario. No gastamos espacio físico.

---

## 🎒 3. Módulo de Colección/Taller: Persistencia Asíncrona (H2 + R2DBC)

* **Técnica:** Eliminamos Postgres por problemas de drivers bloqueantes puros y metimos `R2DBC` con `H2` en modo disco-duro local.
* **Bajo el Capó:** Java lanza sentencias SQL usando el estándar *Reactive Relational Database Connectivity (R2DBC)*. El driver de H2 escribe directamente sobre el archivo `./data/localdb` usando canales de disco asíncronos (AIO). Así guardamos el inventario (`UserInventory`) y las criaturas obtenidas (`BirdCard`).
* El *Crafting* (El Taller) es una operación atómica: Java consume materiales y mediante `Math.random` y el catálogo en la nube, "Forja" un ave y envía a disco la instrucción de inserción `save()`.

---

## ⚔️ 4. Módulo de Certamen: Red TCP Bidireccional Pura (RSocket)

A diferencia de llamadas REST (`http://`) genéricas para hacer el minijuego, usamos sockets TCP mediante el protocolo **RSocket**.

* **Técnica:** El cliente y Java en el puerto `7000` (`BattleRSocketController`) establecen un tubo de conexión que nunca se corta (TCP persistant).
* **Backpressure:** A diferencia de WebSocket (que lanza chorros de datos descontrolados inundando el cliente y crasheando móviles malos), RSocket en Java tiene *Backpressure*. Si Java intenta enviar que te hicieron 100 ataques mágicos por segundo, pero tu móvil (frontend) solo puede procesar 5, Java lo detecta a nivel TCI/IP y ralentiza la cadencia.

> 🏢 **Equivalencia en la Vida Real:**
> API REST (HTTP) es como enviar **Cartas por buzón**. Tomas la carta, la envías, el otro la recibe, la lee, redacta la carta, te manda la Paloma. Es Lento.
> **RSocket:** Es levantar el teléfono y dejar la **llamada abierta todo el día**. Gritas "Ataque" y al otro lado el altavoz lo grita en tiempo real al instante.

---

## 🏦 5. Módulo Marketplace: Pseudo-Redis y Concurrencia de Memoria

Hemos evitado obligar al usuario a instalar Bases de Datos caché monstruosas usando los inyectores internos de la JVM de Java 21 instalando un servicio P2P.

* **Técnica:** `MarketplaceService` alberga un `ConcurrentHashMap` ultra-rápido en la propia Memoria RAM. Para prever robos o el "Problema de doble Gasto" (dos personas intentando comprarle el mismo pájaro al usuario X a la vez).
* **Cerrojos Atómicos (`synchronized`):** Cuando en Java declaras un bloque sobre un objeto con la palabra `synchronized`, fuerzas al Sistema Operativo Windows/Linux a "Conceder un Thread Lock" bajo nivel al procesador CPU core. Si el proceso A (Paco) está ejecutando esa línea de código (comprando el pájaro), el core congela físicamente el proceso B (María) durante milisegundos dejándolo en la puerta hasta que Paco acabe, evadiendo duplicaciones ilegales de cartas.

---

## 🐇 6. Módulo Event Broker: RabbitMQ (AMQP) en Segundo Plano

* **Técnica:** Cuando el combate acaba, inyectar dinero al jugador podría bloquear los milisegundos vitales de cerrar el juego e ir al lobby a celebrar.
* **Solución DTO:** El `BattleService` serializa (convierte de RAM volátil Java a secuencias de bytes universales binarias) el evento `RewardEvent` usando el protocolo `AMQP` de RabbitMQ.
* **Listeners:** En otro hilo totalmente desconectado del padre, el `RewardConsumerService` usa la anotación `@RabbitListener` que se traga la orden del evento "como si leyera un registro contable" e inyecta las semillas en la base de datos `H2`. Completamente acoplado de forma débil (Loose Coupling).

> 🏢 **Equivalencia en la Vida Real:**
> Llegas a la meta de una Maratón (El Combate RSocket terminando). El Organizador debe darte el Cheque Premio de 50 Semillas. Pero en ese momento tú quieres respirar e ir rápido con tu familia. Si el Organizador se te pone a rellenar el papel, validarlo con el banco (modificar la BBDD) tú colapsas de aburrimiento.
> ¿Nuestra solución?: El Organizador simplemente **grita por un Walkie-Talkie** (Exchange de Rabbit): "¡El DORSAL 5 HA GANADO 50!". Tú te vas feliz al hotel y ya ha terminado su tarea. Es un oficinista en un sótano lejano (`RewardConsumerService`) quien escuchó el Walkie-Talkie y con calma registra el dinero en tu cuenta bancaria (Base de datos local H2) mientras tú sigues con tu vida.

---

## 🔐 7. Módulo de Seguridad: Cadena de Filtros JWT

* Todo el Backend ha sido asediado por `spring-security-webflux`.
* **Técnica:** Cualquier Request entrante primero choca contra un **WebFilterChain**.
* Java coge la cabecera del protocolo HTTP: `Authorization: Bearer <ey...Token>`. Se usa algoritmos criptográficos (HS512) para que el `JwtUtil` machaque e intente decodificar el String de Puntos (`.`) con la firma generada por el `AuthController`. Si no empata, devuelve la excepción 401 UNAUTHORIZED directamente desde la capa Netty sin llegar siquiera a despertar al core del framework Spring. Esto hace al servidor increíblemente resiliente a ataques DDoS rudimentarios.
