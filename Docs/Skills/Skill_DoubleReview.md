# Skill: Doble Revisión de Integridad (Double-Review)

Este procedimiento estandariza el mandato de **Roberto Monedero Alonso** de revisar cada modificación al menos dos veces para garantizar la solidez arquitectónica.

## 📋 Protocolo de Revisión

### Fase 1: Certificación Lógica (Negocio)
- **Objetivo:** Validar que el código cumple con los requisitos funcionales sin efectos secundarios.
- **Checklist:**
  - [ ] ¿La lógica de negocio es asíncrona/reactiva (WebFlux/RSocket)?
  - [ ] ¿Se respeta la jerarquía de directorios definida en `04_Arquitectura_Workspaces.md`?
  - [ ] ¿Se han evitado "hacks" temporales o payloads mal estructurados?

### Fase 2: Certificación de Integridad (Técnica)
- **Objetivo:** Validar la sintaxis, tipos y dependencias.
- **Checklist:**
  - [ ] **Dependencias:** ¿Están todas las librerías usadas presentes en el `pom.xml`?
  - [ ] **Tipos:** ¿Se han resuelto los errores de tipos (ej: UUID vs String)?
  - [ ] **Persistencia:** ¿Es puramente relacional (R2DBC)?
  - [ ] **Networking:** ¿Escucha en `0.0.0.0` para Tailscale?

## 🛠️ Aplicación en el Flujo Dev
Antes de considerar una tarea como completa, el desarrollador (o IA) debe auto-emitir un "Reporte de Doble Revisión" en la bitácora o en el walkthrough.
