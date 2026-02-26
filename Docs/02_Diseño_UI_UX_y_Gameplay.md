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

## 🗺️ Flujo de Pantallas

### 1. El Santuario (Home)
Hub principal del juego. Árbol interactivo con pájaros de la colección del jugador animados (CSS: balanceo, caída de hojas). Panel superior con clima actual y recursos (Semillas, Notas, Reputación). Cambia de color según la fase del día (Mañana / Mediodía / Tarde / Noche).

### 2. La Expedición
El jugador elige un **Bioma** (Bosque, Costa, Montaña) y un **Cebo** (Semillas, Fruta, Insectos) que inicia un temporizador pasivo. Contiene el minijuego de **"Enfoque"**: slider de nitidez de cámara para capturar el _sweet spot_ y ganar Notas de Campo extra.

### 3. El Taller (Crafting)
Mesa de madera con **3 slots** (Foto, Pluma, Notas). Panel inferior con el inventario de materiales. Al completar los slots, se lanza la animación de _"Pintando carta con acuarelas"_ que genera el ave en la colección.

### 4. El Certamen (Batalla 1v1)
Duelo por turnos. Selección de ave → Arena de batalla con animaciones → Pantalla de resolución con recompensas (Semillas + Reputación).

### 5. El Álbum (Colección)
Grid de cartas con estado (descubierta / no descubierta). Cada carta tiene:
- **Cara A:** Stats de combate (Costo, Postura, HP)
- **Cara B:** Información educativa real (Nuthatch API: nombre científico, hábitat, audio del canto)

### 6. Otras pantallas
- **Market:** Subastas en tiempo real (WebFlux + Redis)
- **Bandada (Social):** Chat grupal RSocket, eventos de comunidad
- **Perfil:** Logros, reputación, aves raras

---

## ⚙️ Mecánicas de Juego

### El Ciclo de Vida Diario del Jugador

```
🌅 Mañana  → Expedición: recolectar materiales (Madera, Bayas, Fibras)
☀️ Mediodía → Taller: construir la Estación de Reclamo combinando materiales
🌇 Tarde    → Notificación: el servidor sincroniza clima + probabilidad → atrae un ave → foto → carta
🌙 Noche    → Certamen: usar cartas nuevas para ganar Reputación y Metal (material raro)
```

### Materiales

| Material | Fuente | Efecto |
|---|---|---|
| Madera | Expedición bosque | Atrae aves de árbol |
| Fibras/Hierbas | Expedición montaña | Camuflaje; sin ellas las aves tímidas no aparecen |
| Metal/Restos | Certamen (noche) | Estructuras urbanas o resistentes |
| Semillas/Fruta/Insectos | Minijuego Enfoque | Define la dieta y especie probable |

### Construcción de la Estación de Reclamo (Crafting → Backend)

El servidor calcula qué pájaro aparece según:
1. **Base (Madera/Metal):** determina la familia de aves (Madera → Pájaro Carpintero)
2. **Cebo:** determina la dieta (Insectos → Insectívoros)
3. **Clima (API wttr.in):** si llueve, aumenta la probabilidad de aves que buscan refugio

La estación tiene **durabilidad limitada** (18h), obligando a reiniciar el ciclo económico.

---

## ⚔️ Sistema de Batalla (El Certamen)

### Tablero
- **Zona de juego:** 3 huecos por jugador
- **Mana (Semillas):** progresivo — Turno N = N Semillas para invocar aves

### El Triángulo de Poder (Piedra-Papel-Tijera Aviar)

| Postura | ↑ Vence a | Lógica |
|---|---|---|
| 🔴 **Canto** | 🟢 Plumaje | El grito asusta a la belleza |
| 🟢 **Plumaje** | 🔵 Vuelo | La belleza distrae al movimiento |
| 🔵 **Vuelo** | 🔴 Canto | La velocidad escapa del ruido |

Modificador climático: `"Si llueve, gana +1 en Vuelo"` (Habilidad Pasiva de la carta).

### Resolución del Duelo
- **Victoria:** El pájaro rival huye (eliminado de la mesa)
- **Empate:** Ambos quedan "cansados" (permanecen pero debilitados)
- **Derrota:** Tu pájaro se retira del combate

---

## 🌍 Módulo Social

### Bandadas (Sindicatos de Naturalistas)
- **Chat en tiempo real:** RSocket (baja latencia)
- **Eventos de comunidad:** misiones grupales con recompensas colectivas
- **Estrategia compartida:** consejos automáticos post-batalla

### Marketplace Reactivo
- Compra/venta de cartas crafteadas o repetidas
- **Subastas en tiempo real:** WebFlux + Redisson (bloqueos distribuidos anti-doble-gasto)
- Búsquedas en sub-milisegundos con Redis

### Santuarios Visitables
La sección "El Santuario" de cada jugador puede ser visitada por su Bandada, mostrando aves raras y logros conseguidos.

---

## ♿ Accesibilidad
- Etiquetas descriptivas (`aria-label` / Semantics) en todos los botones interactivos
- Feedback háptico (vibración suave) en victorias y validaciones del minijuego Enfoque
- Alto contraste garantizado entre fondo e íconos en todas las fases del día
