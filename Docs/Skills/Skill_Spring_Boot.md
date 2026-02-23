# Skill: Desarrollo Spring Boot Reactivo

## Contexto
El backend está basado en Spring Boot 3 con WebFlux (Project Reactor), diseñado para ser no bloqueante (Asíncrono) para manejar alta concurrencia.

## Tecnologías Core
- **Spring WebFlux:** Para endpoints reactivos (`Mono<>`, `Flux<>`).
- **Spring Data R2DBC:** Para conexión a PostgreSQL asíncrona.
- **RSocket:** Para comunicación en tiempo real bidireccional en las batallas (Certamen) y Marketplace.
- **Redis Reactive + Redisson:** Caché y bloqueos distribuidos para subastas.

## Reglas de Implementación
1. Nunca utilizar operaciones bloqueantes (ej. `Thread.sleep`, llamadas directas a base de datos JDBC, `RestTemplate` síncrono). Todo debe ser `subscribe()`, `map()`, `flatMap()`, etc., o usar `WebClient`.
2. Las entidades con relaciones complejas o propiedades sin estructura fija deben mapearse utilizando tipos `JSONB` de PostgreSQL con conversores Jackson/R2DBC personalizados.
3. Enviar todo el trabajo post-request (dar experiencia, logs adicionales) a RabbitMQ o Kafka (Event Broker) para no penalizar la respuesta de latencia del cliente.
