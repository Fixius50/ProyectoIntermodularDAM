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
