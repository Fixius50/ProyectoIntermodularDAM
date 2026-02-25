# Roadmap de Backend Core: AVIS Naturalist App

Este documento sirve como guía maestra para la implementación del servidor externo y la lógica de negocio completa del juego.

## 1. Infraestructura y Arquitectura

### Servidor Externo
- **Plataforma Recomendada**: Railway, Render o AWS (EC2/RDS).
- **Core**: Java 17+ con Spring Boot 3.4.
- **Base de Datos**: PostgreSQL (para persistencia relacional de colecciones y usuarios).
- **Contenerización**: Docker para facilitar el despliegue en entornos externos.

### Seguridad y Auth
- Implementación de **Spring Security** con **JWT** (JSON Web Tokens).
- Los usuarios podrán sincronizar su progreso entre dispositivos.

---

## 2. Módulos del Sistema

### Módulo de Aves (Birds)
- **BirdRecord Entity**: Mapeo completo de la Nuthatch API.
- **Leveling Logic**: Algoritmo de cálculo de XP y subida de nivel.
- **Stats Scalability**: Cómo aumentan ATK/DEF/VEL según el nivel.

### Módulo de Expedición (Exploration)
- **RNG Service**: Lógica de "avistamiento" basada en Bioma, Cebo y Clima.
- **Persistence**: Estado de expedición actual (si el usuario cierra la app, la expedición sigue en curso).

### Módulo de Certamen (Battle)
- **Validation**: El servidor debe validar que el usuario posee las cartas que intenta jugar.
- **AI Engine**: Lógica para los rivales (NPCs) que se ajuste al nivel del jugador.
- **Multiplayer (Beta)**: Preparación para duelos reales usando WebSockets (Spring WebFlux).

### Módulo de Inventario
- CRUD de materiales (Madera, Metal, Plumas, Fotos).
- Lógica de "Recetas" para el registro de nuevas aves.

---

## 3. Plan de Sprints Sugerido

| Sprint | Enfoque | Entregable Key |
| :--- | :--- | :--- |
| **S1** | Infraestructura | Spring Boot App + DB PostgreSQL desplegada. |
| **S2** | Usuarios y Birds | Login funcional y CRUD de Colección (con Niveles). |
| **S3** | Expediciones | Lógica de RNG y recompensas de materiales. |
| **S4** | Certamen | Validación de duelos y guardado de reputación. |

---

## 4. Estrategia de Servidor Externo

Para que la aplicación sea accesible por la APK de Android desde cualquier lugar:
1. **Configuración de CORS**: Permitir el origen del frontend (Web y móvil).
2. **Reverse Proxy**: Uso de Nginx o el ingress por defecto del proveedor con SSL (HTTPS).
3. **Endpoints**:
    - `POST /api/v1/auth/login`
    - `GET /api/v1/collection`
    - `POST /api/v1/expeditions/start`
    - `POST /api/v1/battle/resolve`

---
*Este roadmap asegura que el equipo tenga una visión clara de hacia dónde va el desarrollo del backend para soportar un entorno de producción real.*
