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

## Listado de Aves (Referencias Nuthatch API)

Se han definido las siguientes 6 aves iniciales. Las imágenes deben servirse desde el CDN de Nuthatch: `https://nuthatch.lastelm.software/assets/images/{scientific_name_underscored}.jpg`

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
