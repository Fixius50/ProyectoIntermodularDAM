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
