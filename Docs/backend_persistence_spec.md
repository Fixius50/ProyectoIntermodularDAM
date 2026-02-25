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
