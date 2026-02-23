# 06. Arquitectura Funcional del Backend (Java/Spring)

Este documento detalla la estructura lógica y técnica del servidor "AVIS" implementado en Java 21 utilizando el stack asíncrono y reactivo de Spring Boot 3.

## Filosofía del Diseño

El ecosistema AVIS requiere soportar concurrencia masiva (batallas en tiempo real, marketplace vivo) sin agotar la memoria del servidor. Por ello, se ha adoptado una arquitectura **100% Non-Blocking (Reactiva)** basada en la especificación Reactive Streams (`Project Reactor`).

## Stack Tecnológico Principal

- **Framework:** Spring Boot 3 (WebFlux / Netty).
- **Controladores REST:** Devoluciones de tipos `Mono<T>` y `Flux<T>`.
- **Comunicación Real-time:** `RSocket` (Más rápido y ligero que WebSockets, con Backpressure nativo).
- **Persistencia Local:** `Spring Data R2DBC` conectado a un archivo local de **SQLite** para todo el progreso del jugador (inventario, cartas obtenidas, etc.). No se guardan tablas en el servidor externo.
- **Caché y Locks:** `Spring Data Redis Reactive` combinado con `Redisson` para protección de concurrencia (Distributed Locks).
- **Procesamiento en Diferido:** `RabbitMQ / Kafka` para resolver experiencia y recursos tras batallas.

---

## 1. Módulo Core: Catálogo Universal (API)

- **Función:** Servir la librería de cartas base de forma veloz.
- **Implementación:** `BirdCatalogController` -> `BirdCatalogService`.
- **Datos (Cloud JSON):** En lugar de usar una base de datos, el backend o el cliente descarga directamente el `JSONVacio.JSON` desde un Storage/URL en la nube. Spring WebClient (o carga en memoria al arrancar) lo parsea en el objeto `BirdRecord` para servir las consultas sin impactar en DB.

## 2. Módulo de Inventario y Colección (La Expedición)

- **Función:** Registrar pasiva/activamente los materiales recolectados por el geolocalizador y el minijuego de "enfoque".
- **Composición:**
  - `UserInventory`: Modelo reactivo que guarda Madera, Fibra, Metal, Cebos y "Notas de Campo".
  - `InventoryService`: Lógica asíncrona para sumar/gastar recursos sin bloquear el flujo.
  
## 3. Módulo de Crafteo (El Taller del Naturalista)

- **Función:** Permitir a los jugadores intercambiar materiales por cartas de aves.
- **Mecánica:** El `CraftingService` evalúa 3 variables: Estructura Base, Tamaño, y Cebo, solicitando a su vez el clima del ecosistema (vía llamada de WebClient externo) para generar un *drop rate* del ave. Si tiene éxito, se instancia una nueva `BirdCard` al jugador.

## 4. Módulo de Batallas (El Certamen)

- **Función:** El sistema PvP basado en Energía (Semillas) y el Triángulo de Debilidades (Canto > Plumaje > Vuelo > Canto).
- **Implementación (RSocket):**
  - `@MessageMapping` maneja las acciones por turno. Al usar RSocket, no hay polling innecesario.
  - El servidor retiene el estado en memoria volátil de la `BattleSession` que, finalizada, despacha un evento a Kafka/RabbitMQ para entregar la recompensa al ganador e indirectamente limpiar la sesión.

## 5. Módulo Social (Bandadas y Marketplace)

- **Marketplace Vivo:** Un controlador WebFlux que extrae ofertas de cartas en memoria utilizando **Redis**, para una recarga ágil y sin latencia.
- **Anticlonación:** En el momento de la venta/compra se solicita un cerrojo distribuido (`RLockReactive` de Redisson) atado a la Request. Si un usuario intenta comprar un ave ya pedida milésimas antes por otro, recibe notificación de error controlado, previniendo incoherencias de BD.
- **Bandadas:** Chat manejado vía streams de RSocket directo entre IDs registrados.
