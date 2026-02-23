# 02 Diseño UI/UX (El Cuaderno de Campo Vivo)

## Principios y Metáfora Visual
La aplicación debe sentirse como un diario de naturalista en las manos, pero mágico.

### Sistema de Colores (Naturaleza Soft)
- **Primario:** Verde Salvia (`#7C9A92`) - Acciones principales.
- **Secundario:** Terracota Suave (`#D9A08B`) - Alertas o combate.
- **Fondo:** Papel Crema/Hueso (`#FDFBF7`) - Reduce fatiga visual. Evita blanco puro.
- **Texto:** Gris Carbón (`#2C3E50`) - Alto contraste pero menos agresivo que el negro.

### Tipografía y Formas
- **Títulos:** Merriweather o Lora (Serif)
- **Cuerpo/Botones:** Nunito o Quicksand (Sans Serif)
- **Formas:** Glassmorphism (paneles semitransparentes), Bordes siempre redondeados (`border-radius: 20px`), sin esquinas afiladas.

## Flujo de Pantallas
1. **El Santuario (Home):** Vista de descanso con clima dinámico (Lottie/SVG). Árbol con pájaros interactivos (audio/animación).
2. **Expedición (Minijuegos):** Selector de bioma (Bosque, Costa, Montaña). Minijuego "Enfoque" de fotógrafo (slider de nitidez) para conseguir recursos ("Notas de Campo").
3. **Taller (Crafting):** Construcción de herramientas/cartas en "La Mesa de Madera". Dropzone para Materiales (Base, Tamaño, Cebo) que habilitan el encuentro aviar.
4. **Certamen (Batalla 1vs1):** Duelo estratégico con Triángulo de Poder. Canto (Rojo) vence a Plumaje (Verde), que vence a Vuelo (Azul), que vence a Canto (Rojo). Impacto directo del Clima real.
5. **El Álbum (Colección):** Modal de carta (Cara A: Juego/Stats, Cara B: Educativa con Nuthatch API - mapa, curiosidades, audio).

## Accesibilidad
- Soporte `Semantics` / Etiquetas descriptivas en todos los botones para lectura de pantalla.
- Feedback Háptico (Vibración suave) en victorias y validaciones (ej. éxito en minijuego Enfoque).
