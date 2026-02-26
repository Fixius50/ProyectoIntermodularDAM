# Reporte de Integración: Certamen (Arena)

Este documento detalla los requisitos técnicos y los puntos de conexión necesarios para que la lógica de combate del Certamen sea persistente, segura y competitiva.

## 1. Arquitectura de Comunicación

Se recomienda un modelo **Híbrido**:
- **WebSocket (Opcional)**: Para combates PvP en tiempo real.
- **REST API (Recomendado)**: Para el modelo actual PvE (Usuario vs CPU).

---

## 2. Endpoints Requeridos (API REST)

### 2.1. Inicio de Encuentro
- **URL**: `POST /api/certamen/match/init`
- **Contenido**:
  ```json
  { "birdId": "p1", "arenaType": "forest" }
  ```
- **Respuesta**:
  ```json
  { "matchId": "uuid-123", "opponent": { "id": "o1", "stats": { "canto": 75, "plumaje": 40, "vuelo": 60 } } }
  ```

### 2.2. Validación de Ronda
**IMPORTANTE**: Para evitar trampas (cheat prevention), el cálculo de ventajas debe ocurrir en el servidor.
- **URL**: `POST /api/certamen/match/resolve-round`
- **Contenido**:
  ```json
  { "matchId": "uuid-123", "round": 1, "selectedAttribute": "vuelo" }
  ```
- **Lógica del Servidor**:
  1. Recupera el `matchId` de la base de datos/caché.
  2. Decide el atributo de la CPU (RNG o IA).
  3. Aplica buffs de clima (validados contra un servicio de meteorología interno).
  4. Calcula el ganador de la ronda.
  5. Devuelve el resultado.

### 2.3. Cierre y Recompensas
- **URL**: `POST /api/certamen/match/finalize`
- **Contenido**: `{ "matchId": "uuid-123" }`
- **Respuesta**: `{ "xpGained": 150, "feathersGained": 20, "newLevel": false }`

---

## 3. Seguridad y Validación

1. **Weather Verification**: El servidor no debe confiar en el clima que envía el cliente. Debe consultar su propia fuente de datos climáticos basada en la ubicación del usuario.
2. **Stat Consistency**: Antes de iniciar, el servidor verifica que el `birdId` pertenece al usuario y que sus stats no han sido manipulados localmente.
3. **Timeouts**: Si el usuario no responde a una ronda en X tiempo, el servidor debe decidir automáticamente la ronda como perdida para el usuario para evitar el estancamiento de partidas.

---

## 4. Requisitos de Base de Datos

- **Tabla `Matches`**:
  - `id`: UUID
  - `user_id`: Link a la cuenta
  - `bird_id`: Ave utilizada
  - `rounds_log`: JSON con el histórico de elecciones y resultados (R1-R5).
  - `status`: 'active', 'finished', 'aborted'.

---

## 5. Próximos Pasos (Frontend)

- Sustituir las constantes locales de `calculateRoundResult` por llamadas a `fetch()` a los endpoints mencionados.
- Implementar un "Loading State" mientras se espera la resolución de la ronda por parte del servidor.
