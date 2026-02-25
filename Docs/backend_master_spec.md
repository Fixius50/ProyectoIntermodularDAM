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
