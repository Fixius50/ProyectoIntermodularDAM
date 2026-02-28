# 02 Diseño UI/UX y Mecánicas de Juego

**El Cuaderno de Campo Vivo** — Referencia unificada de diseño visual, flujo de pantallas y reglas de jugabilidad.

---

## 🎨 Principios Visuales

La aplicación debe sentirse como un **diario de naturalista mágico**.

### Sistema de Colores (Naturaleza Soft)

| Token | Hex | Uso |
|---|---|---|
| Primario | `#7C9A92` | Verde Salvia — acciones principales |
| Secundario | `#D9A08B` | Terracota Suave — alertas, combate |
| Fondo | `#FDFBF7` | Papel Crema — reduce fatiga visual |
| Texto | `#2C3E50` | Gris Carbón — alto contraste |

### Tipografía
- **Títulos:** Merriweather o Lora (Serif)
- **Cuerpo / Botones:** Nunito o Quicksand (Sans-Serif)

### Estética
- **Glassmorphism:** paneles semitransparentes con `backdrop-filter: blur()`
- **Bordes:** siempre redondeados (`border-radius: 20px`), sin esquinas afiladas
- **Animaciones:** 60 FPS, micro-interacciones en hover/tap
- **Clima reactivo:** el fondo cambia según datos reales de wttr.in

---

## 🗺️ Flujo de Pantallas (Estado Actual Implementado)

La aplicación consta actualmente de 7 pantallas principales, cada una con un flujo de usuario detallado y mecánicas interconectadas:

### 1. Autenticación (Login / Registro)
- **Flujo de Usuario:** Pantalla inicial con un selector de idioma (ES/EN). El usuario alterna dinámicamente entre Iniciar Sesión y Registrarse.
- **Campos:** Email, Contraseña y Nombre (solo registro).
- **Proceso:** Envía credenciales al backend (Supabase / Spring Boot). Manejo de errores visuales mediante notificaciones tipo *shake* integradas en el panel.

### 2. El Santuario (Home / Dashboard)
- **Hub Central:** Visión general del entorno del jugador. Se actualiza en tiempo real basado en la API meteorológica (Clima) y la hora local (Mañana, Tarde, Noche).
- **Inventario Rápido:** Visualización condensada superior con el estatus de recursos (Plumas, Stamina).
- **Gestión de Aves:** Un carrusel dinámico ("Aves en el Santuario") con los ejemplares capturados. Permite filtrar por "Favoritos" o "Baja Stamina". Cada ave muestra su salud, y atributos (Canto, Plumaje, Vuelo).
- **Consejo de Naturalista:** Panel dinámico inferior que da un consejo adaptado al clima del día.

### 3. La Expedición (Exploración Local)
- **Mapa Interactivo:** Integración nativa táctil con Leaflet centrada en Pinto (Madrid) y sus parques. Cambia de tema (Claro/Oscuro) automáticamente.
- **Escáner GPS:** El usuario escanea el área buscando aves. Tiene un cooldown de seguridad de 60 segundos.
- **Condiciones Climatológicas:** El escaneo cruza la Fase del Día (Mañana/Tarde/Noche) y el Clima (Lluvia, Sol) con los requisitos biológicos de las aves para determinar cuáles aparecen.
- **Modal de Estudio (Captura):** Si aparece un ave, se muestra foto, descripción científica y "Nota curiosa". El usuario pulsa "Registrar en Mi Diario" para añadirla al Santuario y recibir Plumas y XP.
- **Bitácora de Campo (Panel Derecho):** Un resumen visual estilo diario de las especies descubiertas hasta el momento.

### 4. El Certamen (Sistema de Batalla 1v1)
- **Fase de Selección:** El jugador elige a su Campeón desde su Santuario. (Restricción: Las aves con menos de 20 de Stamina no pueden competir).
- **Fase de Preparación:** Emparejamiento contra un ave local. El usuario puede utilizar consumibles de su mochila (ej. Néctar Floral para subir Canto) antes del duelo.
- **Fase de Combate (5 Rondas):** Sistema de Piedra-Papel-Tijera modificado (Canto vence Plumaje, Plumaje vence Vuelo, Vuelo vence Canto).
  - El usuario puede elegir táctica manual por ronda o gastar su "Habilidad Especial" de la raza.
  - Combos multiplicadores por victorias consecutivas y bufas según el clima (El Vuelo tiene +20% si está despejado).
- **Fase de Recompensas:** Se otorga experiencia y Plumas según el resultado (Victoria, Empate, Derrota). Se resta 20 de Stamina al ave utilizada.

### 5. El Social (Bandadas y Comunidad)
- **Panel de Bandada (Gremio):** Muestra los datos de la "Bandada" del jugador (nivel, miembros) y una "Misión Global" cooperativa con barra de progreso. Permite abrir el "Canal de Voz" (Chat grupal interactivo estilo mensajería).
- **Explorador de Bandadas:** Si el usuario no tiene gremio, ve una lista de gremios disponibles a los que puede unirse en un clic.
- **Muro de Avistamientos (Feed):** Los usuarios publican texto adjuntando aves de su colección (`selectedBirdId`). Muestra publicaciones de otros usuarios (nombre, hora, ubicación, foto). Los jugadores pueden reaccionar con emojis (🐦, 🪶, 📷).

### 6. La Tienda (Suministros y Reventa)
- **Caja Rápida de Monedas:** Visualiza en grande las "Plumas" disponibles.
- **Pestaña Mercado:**
  - **Oferta Dinámica de Clima:** Se ofrece un ítem temporal dependiente del clima (ej. Botas de agua si llueve).
  - **Catálogo Fijo:** Consumibles de estadísticas (Néctar, Semillas) y el *Sobre de Iniciación*.
  - **Apertura de Sobres (Lootbox):** Al comprar un sobre, salta una animación a pantalla completa de 3 segundos revelando 3 nuevas especies de aves y añadiéndolas al Santuario automáticamente.
- **Pestaña Reventa:** Listado del inventario actual para vender consumibles sobrantes por 5 Plumas cada uno.

### 7. Mi Perfil
- **Identidad del Jugador:** Avatar modal (integración API DiceBear) y asignación de Título/Rango basado en XP.
- **Compañero Favorito:** Permite fijar un ave capturada en la tarjeta principal (cara B estadística + arte visual).
- **Estadísticas Biológicas:** Barras de progreso por categorías según los especímenes disponibles globalmente vs. capturados.
- **Medallas (Logros):** Evaluador automático que reparte medallas en caliente si el usuario llega a 10 especies, realiza X expediciones, etc.
- **Historial de Actividad:** Timeline de los últimos eventos (ej. "Capturaste un Petirrojo - Hace 2 min").

---

## ⚙️ Mecánicas de Juego y Persistencia Base

### Estado Global Responsivo (Zustand)
Toda la lógica de recursos y transacciones se mantiene persistente localmente mediante `localStorage` (sin requerir base de datos constante en capa UI).

### El Ciclo Diurno-Nocturno
```
🌅 Mañana  → Expedición: aves madrugadoras en el mapa.
☀️ Mediodía → Mayor concurrencia social, reabastecimiento en Tienda.
🌇 Tarde    → Combinaciones raras bajo ciertos climas de transición.
🌙 Noche    → El Certamen: foco en PvP / PvE táctico.
```

### Triángulo de Batalla en El Certamen
| Atributo | Fuerte Contra | Razón Práctica |
|---|---|---|
| 🔴 **Canto** | 🟢 Plumaje | El ruido asusta el exhibicionismo. |
| 🟢 **Plumaje** | 🔵 Vuelo | La belleza / brillo distrae la trayectoria. |
| 🔵 **Vuelo** | 🔴 Canto | La agilidad evade la frecuencia. |

*(Nota: Aderezado con Habilidades Especiales como "Intimidación" de Rapaces o "Solo Virtuoso" de Pájaros Cantores).*

---

## ♿ Accesibilidad Estándar
- Todo elemento de la UI obedece a **Glassmorphism soft** minimizando estrangulamientos en contornos rígidos.
- Sistema de paletas Dark Mode unificado gestionado vía TailwindCSS (`dark:bg-slate-900`) garantizando legibilidad nocturna óptima.
- Textos con familias tipográficas *display / handwriting* para decoración y *sans* (Quicksand / Roboto) robusto para paneles de datos e inventarios.
