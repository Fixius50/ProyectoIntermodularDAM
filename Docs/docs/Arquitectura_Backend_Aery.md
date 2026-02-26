# Arquitectura y Base de Datos del Backend "Aery"

Para escalar Aery a un entorno multijugador online completo, dejaremos de depender del `localStorage` o lógica en el frontend. El servidor (backend) será la única **fuente de verdad**, albergando las reglas, RNG, posesiones y el motor de combate.

## 1. Esquema de Base de Datos (Relacional - PostgreSQL/MySQL)

A continuación, se describen las tablas fundamentales y sus relaciones.

### `User` (Usuarios y Perfil)
- `id` (UUID, Primary Key)
- `username` (Varchar, Único)
- `email` (Varchar, Único)
- `password_hash` (Varchar)
- `avatar_url` (Varchar)
- `level` (Int) - Calcula o mantiene el nivel actual
- `experience` (Int) - Experiencia total o remanente
- `feathers` (Int) - Moneda premium del juego
- `streak_days` (Int) - Días consecutivos conectado
- `last_login` (Timestamp)
- `created_at` (Timestamp)

### `BirdSpecies` (Catálogo Global de Aves)
Esta tabla alberga los datos estáticos base. Se puebla una sola vez y no la modifica el usuario.
- `id` (String ej. "b1", Primary Key)
- `name` (Varchar)
- `base_rarity` (Enum: Común, Raro, Legendario, Épico)
- `base_stamina` (Int)
- `base_insight` (Int)
- `base_song` (Int)
- `description` (Text)
- `image_url` (Varchar) - URL al S3 o CDN donde se aloja la foto a alta calidad
- `sound_url` (Varchar) - URL al S3 o CDN donde se aloja el sonido de su canto
- `preferred_weather` (Varchar) - Clima donde su RNG de captura sube.

### `UserBird` (Aves capturadas por el usuario)
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key a `User`)
- `species_id` (String, Foreign Key a `BirdSpecies`)
- `experience` (Int) - Experiencia propia del ave para subir de nivel
- `level` (Int) - Nivel actual del ave
- `caught_at` (Timestamp)
- `location_caught` (Varchar) - Coordenadas o nombre de región

### `Item` (Catálogo de Objetos Globales)
- `id` (String, Primary Key)
- `name` (Varchar)
- `description` (Text)
- `type` (Enum: Consumible, Equipo, Cebo)
- `icon` (Varchar)

### `Inventory` (Inventario del Usuario)
- `user_id` (UUID, Foreign Key a `User`)
- `item_id` (String, Foreign Key a `Item`)
- `quantity` (Int)
- Primary Key Combinada: `(user_id, item_id)`

### `Guild` (Bandadas / Clanes)
- `id` (UUID)
- `name` (Varchar)
- `level` (Int)
- `weekly_mission_progress` (Int)

### `GuildMember`
- `guild_id` (UUID)
- `user_id` (UUID)
- `role` (Enum: Lider, Veterano, Explorador)

---

## 2. Especificación de API Backend (Rutas y Endpoints)

### Autenticación y Perfil (`/api/auth` y `/api/user`)
*   `POST /api/auth/register`: Envía `{ name, email, password, initialBirdId }`. Retorna un JWT Token y el estado inicial del usuario.
*   `POST /api/auth/login`: Envía `{ email, password }`. Retorna un JWT Token y toda la información de estado.
*   `GET /api/user/profile`: Retorna la información completa del perfil.
*   `GET /api/user/inventory`: Obtiene el inventario del jugador.
*   `GET /api/user/birds`: Lista todas las aves capturadas.

### Expedición y Clima (`/api/expedition`)
*   `POST /api/expedition/scan`: Envía la ubicación. El servidor calcula qué ave aparece basado en el RNG y los modificadores de clima del servidor.
*   `POST /api/expedition/capture`: Envía el `birdId` descubierto y si se usaron objetos.

### Taller y Tienda (`/api/workshop` y `/api/store`)
*   `GET /api/workshop/recipes`: Lista combinaciones válidas.
*   `POST /api/workshop/craft`: Envía `{ slot1Id, slot2Id }`.
*   `GET /api/store/items`: Retorna el catálogo dinámico de la tienda.
*   `POST /api/store/purchase`: Envía `{ itemId }`.

---

## 3. Comunicaciones y Recursos en el Servidor (S3 / CDN)

Para que la app escale y se descargue rápido en el cliente:
- **Imágenes de Aves y Sonidos:** Se guardarán en un *bucket* de almacenamiento de objetos (Ej: Amazon S3). 
- **Subida de Fotos:** El frontend solicita a Spring Boot una URL Pre-firmada temporal y sube los ficheros pesados (avatares, fotos al feed social) directamente al S3 sin sobrecargar el servidor backend.

---

## 4. Arquitectura del Certamen (Multijugador PvP en Tiempo Real)

Escalar las batallas del **Certamen** a un modelo multijugador con otros usuarios registrados requiere comunicaciones bidireccionales de baja latencia mediante **WebSockets** (STOMP / SockJS).

### Flujo de la Arena Multijugador

1. **Matchmaking (Emparejamiento)**
   - El jugador llama al REST `POST /api/arena/matchmaking` para buscar partida.
   - El Servidor lo pone en una cola en Redis.
   - Cuando hay oponente, envía un evento WebSocket `match_found` con el ID de la sala (`RoomId`).

2. **Fase de Selección (Picks & Bans)**
   - Cada jugador envía por WebSocket: `select_bird { bird_id }`.
   - El Servidor valida la tenencia y manda: `opponent_selected_bird`.

3. **Ciclo de Combate (Turnos - Mejor de 5)**
   - **Inicio de Ronda:** El Servidor pide jugada oculta (Piedra, Papel, Tijera, u objeto).
   - Ambos mandan su acción (`action_submit`).
   - El Servidor resuelve el turno usando stats reales de la BD, aplicando el clima y notifica con `round_result`.

4. **Fin de Partida y Persistencia**
   - El Servidor determina al ganador, suma XP/Plumas en la BD y envía `match_finish`. Todo el reparto se hace en el lado servidor para prevenir hackeos por parte del cliente.

---

## 5. Almacenamiento de Redes Sociales (Social y Bandadas)

Para la pantalla "Social" ("Pinto" / Bandada):
- Se requiere una Base de datos auxiliar o tabla `Posts`.
- **Bandadas (Guilds):** El modelo `Guild` permite agrupar a los usuarios. Los usuarios pueden unirse a una bandada, hablar por un chat grupal y contribuir pasivamente (o activamente) a una `weekly_mission_progress` cooperando entre los miembros de la bandada.
- **El Feed / Pinto:** Las fotos tomadas en las expediciones pueden publicarse. El servidor crea registros con enlaces a S3 cada vez que alguien comparte su avistamiento y los clientes consumen un feed general (`GET /api/social/feed`).
