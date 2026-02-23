# 01 Estrategia Técnica

## Stack Backend (Reactivo y No Bloqueante)
- **Framework Core:** Java 21 con Spring Boot 3 (WebFlux / Alternativa: Spring Web MVC + Virtual Threads)
- **Comunicación en Tiempo Real:** RSocket (Alternativa: WebSockets Clásicos STOMP)
- **Persistencia y Base de Datos:**
  - Supabase (PostgreSQL) con uso intensivo de tipos JSONB
  - Driver: Spring Data R2DBC (Asíncrono) (Alternativa: JPA/Hibernate)
- **Caché y Marketplace:** Spring Data Redis Reactive con Redisson (Distributed Locks)
- **Gestión de Identidad:** Spring Security Reactive + JWT
- **Procesamiento de Eventos:** RabbitMQ / Kafka

## Stack Frontend
- **Framework Core:** React Native
- **Gestión de Estado:** Context / Zustand
- **UX/UI:** Componentes funcionales simples, asegurando que funcione de forma intuitiva sin importar experiencia técnica previa.

## APIs Externas Integradas
- **Nuthatch API:** Datos taxonómicos reales (nombre científico, familia, audios de cantos)
- **Unsplash / Pexels API:** Fondos de cartas dinámicos (hábitats y clima)
- **Vecteezy:** Iconografía vectorial interactiva
- **Weather API:** Para sincronizar probabilidades de avistamiento y estados de UI según clima real.

## Entorno de Desarrollo (Lubuntu)
- Java 21, Maven
- Node.js, npm
- Docker (Redis, RabbitMQ/Kafka local)
- Herramientas internas: AVIS Dev Uploader (Python GUI para push con Git LFS)
