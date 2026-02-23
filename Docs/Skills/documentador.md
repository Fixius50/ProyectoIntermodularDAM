---
description: Skill para forzar comentarios en inglés y formato estándar de documentación de código
---

# Documentador Skill (English Comments Master)

Esta skill se debe aplicar **automáticamente** cada vez que crees, edites en profundidad o refactorices un archivo de código fuente propio de nuestro proyecto (`.java`, `.js`, `.ts`, `.tsx`, `.sql`, etc.).

## 📖 Instrucciones de Obligado Cumplimiento

1. **ENGLISH ONLY FOR COMMENTS**: All inline comments, block comments, Javadoc, and JSDoc tags within the source code MUST be written entirely in English. The chat interface with the user remains in Spanish.
2. **NO SPANGLISH / NO TRANSLITERATION**: Write idiomatic English for your comments. Avoid translating variable names literally if it ruins the sentence context.

## 🛠️ Estructura Esperada por Archivo Creado

Siempre que generes un archivo nuevo en la base del código, asegúrate de acompañar las clases de negocio principales (Controllers, Services, Models, Repositories) de documentación.

Ejemplo base de JavaDoc / JSDoc:

```java
/**
 * Handles the crafting logic combining user inventory and cloud-fetched JSON.
 * Validates dependencies and generates a random drop rate based on predefined attributes.
 */
public class CraftingService {
    // Injecting dependencies locally to prevent database bottleneck
}
```

## ✅ Lista de Verificación de Salida

Antes de finalizar tu tarea y considerar el archivo terminado, hazte la pregunta internamente (Double-Check Protocol):

- ¿Están los comentarios en puro inglés?
- ¿He documentado las lógicas ambiguas o la regla de negocio que hay detrás?
