# Mega Informe de Integración: Aery Backend Specification

Este documento consolida todos los requisitos técnicos para la comunicación entre el frontend (Aery) y el servidor central, cubriendo sistemas de combate, perfiles de usuario, persistencia de progreso y notificaciones.

---

## 1. Sistema de Autenticación y Perfiles

### 1.1. Registro y Login
- **Endpoint**: `POST /api/auth/register` | `POST /api/auth/login`
- **Payload**:
  ```json
  { "email": "user@example.com", "password": "hashed_password", "name": "Nombre" }
  ```
- **Persistencia**: El servidor debe devolver un JWT (JSON Web Token) y los datos iniciales del perfil (rango, nivel, xp).

### 1.2. Guardado de Progreso (Sync)
- **Endpoint**: `POST /api/user/sync`
- **Frecuencia**: Cada vez que el estado local cambie significativamente (fin de combate, nueva especie, compra).
- **Payload**: JSON completo del objeto `User` y `playerBirds`.

---

## 2. Sistema de Certamen (Arena) - Lógica Segura

Para evitar manipulaciones, el servidor es la "Fuente de la Verdad":
- **Match Init**: El servidor genera el `matchId` y elige el ave oponente.
- **Round Resolution**: El cliente envía `selectedAttribute`. El servidor calcula el resultado aplicando:
  - Base stats del ave (validadas en DB).
  - Triángulo de ventajas (Vuelo > Canto > Plumaje > Vuelo).
  - Buffs climáticos (el servidor consulta su propia API de clima).
- **Resultado**: El servidor devuelve el ganador de la ronda y los puntos finales.

---

## 3. Sistema de Notificaciones Persistentes

### 3.1. Tipos de Notificación
- `achievement`: Logros y trofeos.
- `sighting`: Nuevos avistamientos en la zona.
- `system`: Alertas de seguridad o sistema.
- `weather`: Cambios climáticos importantes.

### 3.2. Sincronización
- **Push Notifications**: Se recomienda el uso de WebSockets o Firebase Cloud Messaging para alertas en tiempo real incluso si el usuario no tiene esa pestaña activa.
- **History**: `GET /api/notifications` para recuperar el histórico no leído al iniciar sesión.

---

## 4. Requisitos de Infraestructura (Recomendado)

- **Base de Datos**: PostgreSQL (Relacional) para usuarios y aves; Redis para caché de sesiones y estados de combate activos.
- **Seguridad**: HTTPS obligatorio. Validación de esquema en todos los inputs (Zod/Joi). Rate limiting para evitar fuerza bruta en login.
- **Clima**: Integración con OpenWeatherMap API en el lado del servidor.

---

## 5. Resumen de Flujo de Datos

1. **Login**: Usuario recibe Token + Perfil.
2. **Acción**: Usuario gana combate -> Frontend envía `notifyMatchEnd`.
3. **Servidor**: Valida, actualiza XP, genera una `Notification` de logro.
4. **Frontend**: Recibe la notificación vía WebSocket/Response y dispara el `addNotification` local para mostrar el Toast.
