# 06. Arquitectura Funcional del Backend (Java/Spring Boot)

Este documento no es solo una hoja de ruta, es la **Autopsia Técnica** del servidor "AVIS". Analiza en profundidad qué hace Java bajo el capó, cómo operan los hilos (threads) interactuando con el framework Spring Boot 3, y una equivalencia metafórica de cómo este diseño se trasladaría al mundo real.

---

## 🏗️ 0. Política de Datos e Infraestructura

**Persistencia:** Se ha prohibido el uso de tipos `JSONB`. Toda la persistencia debe ser **relacional** (R2DBC).

**Red (Multijugador):** Se utiliza **Tailscale**. El servidor escucha en `0.0.0.0` (IP Tailscale) en los puertos `8080` (API) y `7000` (RSocket).

---

## 🏎️ 0.1. Lógica de Matchmaking (RSocket)

El flujo de emparejamiento para las batallas multijugador sigue este patrón reactivo:

1.  **Creación de Sala (`battle.room.create`):** Un jugador "Host" envía su ID de jugador y ID de carta. El servidor genera un `sessionId` único y pone la sala en estado `WAITING`.
2.  **Unión a Sala (`battle.room.join`):** Un segundo jugador envía el `sessionId` de la sala. El servidor valida la existencia, vincula al segundo jugador, sincroniza la vida inicial y cambia el estado a `IN_PROGRESS`.
3.  **Duelo en Tiempo Real (`battle.action.stream`):** Ambos jugadores abren un flujo de datos bidireccional. Cada ataque descuenta vida del oponente instantáneamente sin recargar la página.
4.  **Finalización:** Al llegar a 0 HP, el servidor marca `FINISHED`, otorga recompensas vía **RabbitMQ** y notifica a los clientes el ganador.

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

---

# Documentación Exhaustiva Arquitectura Backend - Proyecto AVIS

Este documento contiene la arquitectura detallada, el esquema de la base de datos y los endpoints REST sugeridos para el equipo de Backend. Su propósito es permitir el desarrollo de la persistencia del estado del jugador, inventarios y su interacción principal en el Santuario, asegurando que el Frontend pueda consumir y sincronizar el juego en tiempo real.

---

## 1. Arquitectura y Tecnologías Sugeridas

- **Base de Datos:** PostgreSQL. Ideal para gestionar transacciones (gastos de semillas y materiales) de forma segura. Si se usa Supabase, se obtienen beneficios de subscripciones en tiempo real y Auth integrado.
- **Autenticación:** JWT (JSON Web Tokens). Manejado a través del clásico flujo Login/Signup.
- **Paradigma de Sincronización:** 
  - El Frontend es optimista: aplica cambios inmediatamente a la UI localmente usando `GameContext`.
  - El Frontend envía luego las peticiones al Backend para que persista.
  - El Backend actúa como *Source of Truth* validando recursos (ej. "No puedes gastar 5 semillas si tienes 2").

---

## 2. Modelo de Datos (Esquema Relacional)

### 2.1. Tabla `users` (Gestionada por el Auth Provider)
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `created_at` (Timestamp)

### 2.2. Tabla `player_profiles`
Contiene el estado indivisible e información general del jugador. Se crea un registro autómaticamente cuando el usuario se registra.
- `id` (UUID, Primary Key, Foreign Key -> `users.id`)
- `display_name` (VarChar) - Nombre a mostrar en el Santuario.
- `reputation` (Int, Default: 0) - Puntos de experiencia globales.
- `seeds` (Int, Default: 150) - Moneda principal.
- `field_notes` (Int, Default: 0) - Moneda secundaria/Pases de expedición.
- `updated_at` (Timestamp)

### 2.3. Tabla `user_materials`
Para guardar cantidades de materiales stackeables de crafteo. Un registro por cada tipo de material que posea el usuario.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `player_profiles.id`)
- `material_type` (VarChar) - Enum: `'MADERA', 'METAL', 'FIBRAS', 'CEBO_SEMILLAS', 'CEBO_FRUTA', 'CEBO_INSECTOS'`
- `quantity` (Int, Default: 0)
- *Constraint: `user_id` + `material_type` deben ser unique.*

### 2.4. Tabla `user_craft_items`
Objetos únicos o consumibles importantes que no son puramente materiales básicos.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `player_profiles.id`)
- `item_type` (VarChar) - Enum: `'FOTO', 'PLUMA', 'NOTAS'`
- `created_at` (Timestamp)

### 2.5. Tabla `user_collection` (Álbum de Aves)
Relación entre el usuario y las aves descubiertas en expediciones.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `player_profiles.id`)
- `bird_id` (VarChar) - ID estático del ave que concuerda con el catálogo del frontend (ej: `'bird-1'`).
- `affinity` (Int, Default: 0) - Puntos de afecto al interactuar en el Santuario.
- `discovered_at` (Timestamp)
- *Constraint: `user_id` + `bird_id` deben ser unique.*

### 2.6. Tabla `sanctuary_state` (Mejoras Visuales - Futuro)
Almacena cómo el usuario ha personalizado su Santuario.
- `user_id` (UUID, Primary Key, Foreign Key -> `player_profiles.id`)
- `active_bait` (VarChar, Nullable) - Cebo activo actualmente puesto.
- `bait_expires_at` (Timestamp, Nullable)
- `upgrades` (JSONB) - Campo flexible para mejoras (ej: `{"has_birdbath": true, "tree_level": 2}`)

---

## 3. Especificación de Endpoints REST (API)

Se asume que todas las rutas bajo `/api/*` requieren un **Bearer Token válido** en la cabecera `Authorization`.

### 3.1. Sincronización Inicial del Juego

**`GET /api/game-state`**
- **Propósito:** Devuelve el estado completo del jugador en una sola llamada para hidratar el `GameContext` al iniciar la App.
- **Respuesta Exitosa (200 OK):**
```json
{
  "player": {
    "name": "Naturalista",
    "reputation": 10,
    "resources": {
      "seeds": 120,
      "fieldNotes": 2
    }
  },
  "materials": [
    { "type": "MADERA", "quantity": 10, "icon": "🪵", "label": "Madera" },
    { "type": "CEBO_SEMILLAS", "quantity": 3, "icon": "🌰", "label": "Semillas" }
  ],
  "craftItems": [
    { "id": "uuid-1", "type": "FOTO", "icon": "📸", "label": "Foto" }
  ],
  "collection": [
    { "bird_id": "bird-1", "affinity": 2 },
    { "bird_id": "bird-3", "affinity": 0 }
  ]
}
```

### 3.2. Rutas de Interacción en el Santuario

**`POST /api/sanctuary/feed`**
- **Propósito:** Alimentar a un pájaro en el santuario. Cuesta semillas y aumenta la afinidad.
- **Body:**
```json
{
  "bird_id": "bird-1",
  "seed_cost": 5
}
```
- **Lógica de Servidor:**
  1. Verificar si `player_profiles.seeds >= seed_cost`. Si no, `400 Bad Request`.
  2. Disminuir `seed_cost` de `player_profiles.seeds`.
  3. Aumentar `affinity` en 1 (o valor deseado) para ese `bird_id` en `user_collection`.
- **Respuesta (200 OK):**
```json
{
  "success": true,
  "new_seeds": 115,
  "new_affinity": 3
}
```

### 3.3. Rutas de Expedición y Crafteo

**`POST /api/crafting/craft`**
- **Propósito:** Consumir materiales para obtener un `craftItem`.
- **Body:**
```json
{
  "recipe_id": "FOTO"
}
```
- **Lógica de Servidor:** Consulta una matriz de recetas interna. Verifica que el usuario tenga los materiales requeridos y los descuenta. Añade registro en `user_craft_items`.

**`POST /api/expedition/discover`**
- **Propósito:** Registrar que un ave ha sido capturada/fotografiada y se añade al Álbum.
- **Body:**
```json
{
  "bird_id": "bird-5"
}
```
- **Lógica de Servidor:** Inserta en `user_collection`. Si ya existe, podría sumarse afinidad en su lugar, o devolver un mensaje de "Duplicado convertido en Semillas".

---

## 4. Notas Importantes para el Desarrollador Backend

1. **Diccionario de Aves Estático:** El backend **no** necesita tener una tabla relacional enorme con todas las estadísticas, nombres y hábitats de los pájaros (ataque, defensa, foto). Esta información vive en el Frontend para reducir latencia y payloads. El Backend únicamente actúa como puente relacional usando el `bird_id`.
2. **Validación de Economía:** El frontend nunca debe decir "sumame 5000 semillas". Debe enviar eventos (ej: `POST /api/battle/win`) y es el Backend quien sabe que una victoria da 50 semillas de recompensa. El backend aplica las reglas de negocio críticas.
3. **WebSockets (Opcional pero Recomendado):** Si se conectan futuras mecánicas sociales (ej: subastas, o ver "Aves raras detectadas temporalmente compartidas por otros jugadores"), Supabase Realtime es ideal para ello en el frontend.

---

# Vademécum de Desarrollo Backend: AVIS Naturalist

Este documento consolida toda la información técnica necesaria para implementar el servidor de AVIS Naturalist, asegurando la persistencia por perfil y la sincronización de sesiones.

## 1. Visión General del Sistema
La aplicación utiliza un modelo de cliente-servidor donde el **Backend** es la fuente de verdad única. El frontend (React Native) actúa como una interfaz de visualización y captura de acciones.

---

## 2. Persistencia por Perfil (User Session)
Cada usuario tiene un perfil único identificado por un ID de usuario (vía JWT).

### Entidades Core (Base de Datos PostgreSQL)
1. **Usuarios (`users`)**: Credenciales y metadatos básicos.
2. **Perfiles (`player_profiles`)**: Semillas, Notas de Campo, Reputación, Nivel de Jugador.
3. **Colección (`bird_collections`)**: Relación M:N entre Usuarios y Especies de Aves, incluyendo `nivel_ave` y `xp_ave`.
4. **Inventario (`inventories`)**: Cantidad de materiales (Fotos, Plumas, Madera).
5. **Estado de Expedición (`active_expeditions`)**: Bioma actual, cebo usado y tiempo restante.

---

## 3. Protocolo de Comunicación (API)

### Sincronización de Recursos
El frontend envía actualizaciones tras cambios significativos.
- **POST `/api/v1/sync`**: Envía un snapshot del estado local para reconciliación.
- **GET `/api/v1/collection`**: Devuelve todas las cartas del usuario con sus niveles actuales.

### Sistema de Niveles de Aves
Al ganar un duelo en el Certamen, el frontend envía:
`PUT /api/v1/birds/{id}/xp-gain` -> `{ "xp": 50 }`
El servidor calcula si el ave sube de nivel y devuelve el nuevo estado.

---

## 4. Certamen (Duelo) de 5 Rondas
El duelo ahora se compone de **5 Rondas** (Niveles).
- **Validación de Ronda**: El servidor debe validar que el ave jugada en la Ronda X tenga un coste de semillas <= X.
- **Persistencia**: Se debe registrar el resultado de cada ronda para calcular el veredicto final.

## 5. Integración con Nuthatch API
El backend debe actuar como un proxy para la [Nuthatch API](https://nuthatch.lastelm.software/v2).
- **Caché**: Cachear datos de aves comunes para evitar latencia.
- **Imagen Proxy**: Servir las URLs de imágenes de Nuthatch o manejar fallos redirigiendo a placeholders (como Unsplash).

---

## 5. Roadmap de Implementación (Sprints)
1. **Sprint 1 (Base)**: Configuración de servidor, DB y Auth (JWT).
2. **Sprint 2 (Perfiles)**: CRUD de recursos y colección básica.
3. **Sprint 3 (Lógica de Juego)**: Motor de expediciones (RNG) y niveles.
4. **Sprint 4 (Certamen)**: Validación de duelos y guardado de resultados.

---
*Este documento es la referencia definitiva para la comunicación frontend-backend.*

---

# Especificación Técnica de Persistencia y Comunicación Backend

Este documento detalla la arquitectura de datos y el protocolo de comunicación entre el frontend (React Native) y el servidor externo (Spring Boot) para garantizar que el progreso de cada usuario se guarde correctamente.

## 1. Modelo de Datos (ERD)

Cada "Perfil" de usuario es el corazón de la persistencia. Todo recurso, carta o progreso está vinculado a un `User_ID`.

```mermaid
erDiagram
    USER ||--o| PLAYER_PROFILE : "tiene"
    PLAYER_PROFILE ||--o{ BIRD_COLLECTION : "posee"
    PLAYER_PROFILE ||--o{ INVENTORY : "contiene"
    PLAYER_PROFILE ||--o{ EXPEDITION_STATE : "mantiene"
    
    PLAYER_PROFILE {
        string id PK
        string username
        int reputation
        int level
        datetime last_sync
    }
    
    BIRD_COLLECTION {
        string id PK
        string user_id FK
        string bird_type_id
        int current_level
        int current_xp
        datetime acquired_at
    }
    
    INVENTORY {
        string id PK
        string user_id FK
        string item_type_id
        int quantity
    }
    
    EXPEDITION_STATE {
        string user_id PK/FK
        string current_biome
        string current_bait
        datetime start_time
        string status
    }
```

---

## 2. Protocolo de Sincronización de Sesión

Para evitar pérdida de datos, la aplicación seguirá una estrategia de **"Optimistic UI"** con sincronización en segundo plano.

### Flujo de Comunicación
1. **Inicio de Sesión**: El cliente solicita el `Profile` completo al servidor.
2. **Acciones Locales**: El cliente actualiza el `GameContext` inmediatamente.
3. **Debounced Sync**: Tras una acción (ej: gastar semillas), el cliente espera 2 segundos de inactividad para enviar un `PATCH` al servidor con los cambios.
4. **Heartbeat**: Cada 30 segundos, el servidor valida el estado de la sesión activa.

---

## 3. Endpoints de Comunicación General

| Método | Endpoint | Descripción | Payload Sugerido |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/profile` | Recupera el estado completo del jugador. | N/A |
| **PATCH** | `/api/v1/profile/resources` | Actualiza semillas, notas o reputación. | `{ "seeds": 120, "fieldNotes": 5 }` |
| **POST** | `/api/v1/collection/add` | Registra una nueva ave tras el Taller. | `{ "birdId": "gorrion-1", "level": 1 }` |
| **PUT** | `/api/v1/collection/{id}/xp` | Sincroniza XP ganada en Certámenes. | `{ "xpAdded": 50 }` |
| **GET** | `/api/v1/sync/session` | Valida que el estado local coincide con el BS. | `{ "checksum": "a7b3..." }` |

---

## 4. Gestión de Perfiles y Servidor Externo

- **Persistencia por Perfil**: Los datos no se guardan localmente (salvo caché temporal). Si el usuario cambia de dispositivo, sus cartas y recursos aparecerán al loguearse.
- **Seguridad**: Todas las peticiones deben incluir el header `Authorization: Bearer <JWT>`.
- **Escalabilidad**: El servidor externo manejará las conexiones de múltiples usuarios simultáneos, asegurando que las transacciones de recursos (ej: crafteo) sean atómicas en la base de datos PostgreSQL.

---
*Este documento complementa el Roadmap de Backend y el Informe de Aves, proporcionando la lógica estructural de la comunicación.*

---

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

---

# Reporte de Implementación: Sistema de Niveles y Colección de Aves

Este informe detalla los cambios necesarios en el backend para soportar el nuevo sistema de niveles y los 6 pájaros iniciales de la colección.

## Resumen del Sistema de Niveles

Cada carta de ave (`BirdCard`) ahora incluye tres campos adicionales:
- `level` (Integer): Nivel actual del ave.
- `xp` (Integer): Experiencia actual acumulada en el nivel.
- `xpToNextLevel` (Integer): Umbral de experiencia para subir al siguiente nivel.

### Atributo Predominante
El atributo predominante se mapea al campo `preferredPosture` existente:
- **VUELO** (Predomina Velocidad/Agilidad)
- **CANTO** (Predomina Ataque Mágico/Influencia)
- **PLUMAJE** (Predomina Defensa/Resistencia)

## Listado de Aves (Imágenes y Referencias)

Actualmente, el frontend utiliza imágenes de alta calidad de Unsplash como marcadores de posición premium. Una vez que el backend esté integrado, las imágenes deberán obtenerse dinámicamente de la Nuthatch API (campo `images` o similar en la respuesta JSON).

| Nombre Común | Nombre Científico | Atributo | Hábitat |
| :--- | :--- | :--- | :--- |
| Gorrión Común | Passer domesticus | CANTO | BOSQUE |
| Martín Pescador | Alcedo atthis | VUELO | AGUA |
| Águila Real | Aquila chrysaetos | VUELO | MONTAÑA |
| Petirrojo | Erithacus rubecula | CANTO | BOSQUE |
| Gaviota Patiamarilla | Larus michahellis | PLUMAJE | AGUA |
| Mirlo Común | Turdus merula | CANTO | BOSQUE |


## Cambios Sugeridos en Backend

### 1. Base de Datos (Entidad BirdCard/Record)
Añadir columnas `level`, `xp` a la tabla que almacena la colección del usuario. `xp_to_next_level` puede ser calculado o almacenado.

### 2. Lógica de Nivelación
Sugerencia de fórmula para XP: `xpToNextLevel = level * 100 * 1.5` (progresivo).

### 3. NuthatchService
Asegurarse de que el mapeo de `scientificName` sea exacto para construir las URLs de las fotos correctamente si no se obtienen directamente del JSON de la API.

---
*Este reporte sirve de guía para que el compañero implemente la persistencia y la lógica de negocio en el backend Java.*

---

# Backend Technical Report & Integration Guide

This document provides a comprehensive overview of the AVIS backend architecture and services, intended for the backend developer to facilitate integration.

## 🏗️ Architecture Overview

The backend is built using a modern reactive stack:
- **Framework**: Spring Boot 3.4.3 (Downgraded from 4.0.3 for compatibility with Redisson and Spring Security).
- **Runtime**: Java 21.
- **Paradigm**: Reactive / Non-blocking (Project Reactor / WebFlux).
- **Database**: PostgreSQL via R2DBC (Supabase).
- **Messaging**: RabbitMQ.
- **Cache & Locks**: Redis + Redisson.
- **Communication**: REST for management, RSocket for real-time events (Battle/Expedition).

## 🛠️ Key Services

### 1. Expedition Service (`ExpedicionScreen` Integration)
- **Logic**: Handles starting, timing, and completing birdwatching expeditions.
- **Endpoints**:
  - `POST /api/expeditions/start`: Accepts `biome` and `bait`.
  - `GET /api/expeditions/status`: Retrieves current progress.
- **Integration Note**: The frontend currently uses a local timer; the backend should provide the source of truth for completion.

### 2. Crafting Service (`Taller` Integration)
- **Logic**: Manages the combination of "Foto", "Pluma", and "Notas" to create "Bird Cards".
- **Validation**: Ensures player has required materials in inventory.
- **Class**: `CraftingService.java`.

### 3. Inventory & Marketplace
- **InventoryService**: Handles resource counting (Seeds, Field Notes).
- **MarketplaceService**: Reactive stream of available items for trade.

### 4. External Integrations
- **WeatherService**: Retrieves real-time weather data (affects bird spawns).
- **WikidataBirdService**: Fetches bird metadata and images from open sources.

## 🔧 Database Schema
Managed via R2DBC. Main entities:
- `User`: Authentication and profile.
- `Inventory`: Resource tracking.
- `BirdCard`: Player collection.
- `Expedition`: State of active/past explorations.

## 🚀 Running the Backend
1. **Prerequisites**: Redis (6379) and RabbitMQ (5672) must be running.
2. **Execution**:
   ```bash
   ./mvnw spring-boot:run
   ```
3. **Logs**: Check `backend.log` for runtime issues.

## 📝 Recent Fixes (Done)
- **Incompatibility Fix**: Reverted to Spring Boot 3.4.3 to resolve `ClassNotFoundException` in `RedissonAutoConfigurationV2`.
- **Dependency Cleanup**: Fixed `pom.xml` test starters and versions.

---

# Guía de Integración Backend por Pantalla

Este documento detalla los requisitos de datos y comunicación específicos para cada pantalla de la aplicación AVIS Naturalist.

---

## 1. Pantalla de Inicio (Dashboard / Home)
- **Recursos**: Saldo total de `Semillas` (🌰) y `Notas de Campo` (📝).
- **Avisos**: Feed de notificaciones recientes (ej: "Tu expedición ha terminado").
- **Endpoints**: `GET /api/v1/player/summary`

---

## 2. Pantalla: Álbum (Colección)
- **Datos Requeridos**: Lista completa de `BirdCards` del usuario.
- **Detalles por Carta**: `Nivel`, `XP`, `Estado` (Activo/Inactivo).
- **Logros Relacionados**: "Coleccionista Principiante" (5 aves), "Experto" (20 aves).
- **Endpoints**: `GET /api/v1/collection`

---

## 3. Pantalla: Expedición (Explora)
- **Estado de Sesión**: Si hay una expedición en curso, tiempo restante y bioma.
- **Recursos**: Consumo de `Notas de Campo` para iniciar.
- **Logros**: "Explorador de Costa", "Montañero".
- **Avisos**: Notificación push/aviso al completar el temporizador.
- **Endpoints**:
    - `POST /api/v1/expeditions/start`
    - `GET /api/v1/expeditions/current`
    - `POST /api/v1/expeditions/claim` (para recoger recompensas)

---

## 4. Pantalla: Taller (Workshop)
- **Inventario**: Cantidad de materiales (Madera, Fotos, Plumas).
- **Recetas**: El backend debe validar que el usuario tiene los materiales antes de crear una carta.
- **Logros**: "Artesano Naturalista".
- **Endpoints**:
    - `GET /api/v1/inventory`
    - `POST /api/v1/craft/bird`

---

## 5. Pantalla: Certamen (Duelo)
- **Atributos de Combate**: El backend calcula el resultado (o valida el cálculo del cliente).
- **Reputación**: Puntos ganados/perdidos tras cada enfrentamiento.
- **Logros**: "Vencedor de Gorriones", "Racha de Victorias".
- **Avisos**: Desafíos de otros usuarios (Coop).
- **Endpoints**:
    - `POST /api/v1/battle/resolve`
    - `GET /api/v1/leaderboard`

---

## 6. Sistema de Logros (Achievements)
- **Modelo**:
    - `ID`, `Nombre`, `Descripción`, `Icono`, `Estado` (Bloqueado/Desbloqueado), `Fecha`.
- **Lógica**: El servidor dispara el logro automáticamente según las acciones (ej: al llegar a Nivel 10 de un ave).

---

## 7. Sistema de Avisos (Notifications)
- **Tipos**:
    - **Sistema**: Mantenimiento, eventos temporales.
    - **Progreso**: "Tu huevo ha eclosionado".
    - **Social**: "Tu amigo ha batido tu record".
- **Endpoints**: `GET /api/v1/notifications` (polling o WebSocket).

---
*Este guía asegura que cada parte de la UI tenga el soporte de datos necesario en el servidor externo.*

---

8. Evolución de la Arquitectura: APIs Externas y Brokers de Mensajería
Para soportar las nuevas mecánicas de juego (Mercado, Crafteo, Batallas en tiempo real y Bandadas), la arquitectura del servidor backend se ha expandido, integrando servicios locales para la gestión de colas y bloqueos de concurrencia, así como llamadas a APIs externas para enriquecer el mundo de juego.

8.1. Nuevas Dependencias de Infraestructura (Lubuntu)
El servidor ahora requiere dos servicios adicionales corriendo en segundo plano:

RabbitMQ: Actúa como Message Broker para gestionar de forma asíncrona los eventos del juego (como el reparto de recompensas) sin bloquear los hilos principales de ejecución.

Redis: Base de datos en memoria (Caché) utilizada por Redisson para gestionar Locks (bloqueos distribuidos) en el Marketplace, previniendo condiciones de carrera si dos usuarios intentan comprar el mismo ítem simultáneamente.

Comandos de instalación y despliegue:

Bash
sudo apt update
sudo apt install redis-server rabbitmq-server -y
sudo systemctl enable --now redis-server
sudo systemctl enable --now rabbitmq-server
8.2. Integración de APIs Externas (World Building)
El motor de juego se alimenta de datos del mundo real mediante las siguientes APIs REST:

OpenWeatherMap: Obtiene el clima real en las coordenadas del jugador, influyendo dinámicamente en el tipo de aves que pueden aparecer (ej. aves acuáticas durante la lluvia).

Wikidata / Unsplash: Proveen de forma dinámica información taxonómica e imágenes de alta calidad (libres de derechos) para poblar el catálogo de aves en caso de no disponer de arte nativo.

Nuthatch API: Base de datos ornitológica mundial empleada para validar y extraer estadísticas base de las especies reales.

8.3. Archivo de Configuración Definitivo (application.yml)
Toda la configuración de red (preparada para la VPN Tailscale), seguridad JWT, credenciales de base de datos y APIs externas se centraliza en el archivo src/main/resources/application.yml:

YAML
spring:
  application:
    name: AvisBackend

  # Conexión asíncrona a Supabase (PostgreSQL)
  r2dbc:
    url: r2dbc:postgresql://db.shmutxsmjokamnxrkufe.supabase.co:5432/postgres
    username: postgres
    password: ${DB_PASSWORD}

  # Message Broker para eventos asíncronos
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest

  # Caché en memoria para Locks de Subastas
  data:
    redis:
      host: localhost
      port: 6379

  # Configuración del Servidor RSocket (Batallas) - Escucha global para VPN
  rsocket:
    server:
      port: 7000
      transport: tcp
      address: 0.0.0.0

# API REST Estándar - Escucha global para VPN
server:
  port: 8080
  address: 0.0.0.0

# Credenciales de APIs Externas
api:
  weather:
    url: "https://api.openweathermap.org/data/2.5"
    key: "${WEATHER_API_KEY}"
  unsplash:
    url: "https://api.unsplash.com"
    key: "${UNSPLASH_ACCESS_KEY}"
  nuthatch:
    url: "https://nuthatch.lastelm.software"
    key: "${NUTHATCH_API_KEY}"

# Seguridad y firma de tokens
jwt:
  secret: "UnaClaveSecretaMuyLargaYComplejaParaFirmarLosTokensDeAvis2026"
  expiration: 86400000 # 24 horas
8.4. Troubleshooting: Permisos de Ejecución (Maven Wrapper)
En sistemas basados en Linux, es común que al clonar o actualizar repositorios, los scripts pierdan sus permisos de ejecución.

Error: bash: ./mvnw: Permiso denegado

Causa: El sistema operativo bloquea la ejecución del script por motivos de seguridad.

Solución: Otorgar permisos de ejecución al archivo antes de compilar:

Bash
chmod +x mvnw
8.5. Ciclo de Compilación y Despliegue Estándar
Cada vez que se actualiza el código o la configuración (.yml), el proceso seguro de reconstrucción en el servidor de producción es:

Bash
# 1. Empaquetar el nuevo .jar omitiendo los tests para mayor rapidez
./mvnw clean package -DskipTests

# 2. Reiniciar el demonio del sistema para inyectar la nueva versión
sudo systemctl restart avis-server.service

# 3. Monitorizar la correcta conexión a Redis, RabbitMQ y Supabase
sudo journalctl -u avis-server.service -f
