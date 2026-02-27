# 08 Guía Técnica del Servidor (Backend) — AVIS

Esta documentación está destinada al responsable del servidor para asegurar la paridad entre el cliente móvil y la lógica de negocio central.

---

## 1. Stack Tecnológico Actualizado
- **Framework**: Spring Boot 4.0.0 (basado en Spring Framework 7 / Jakarta EE 11).
- **Runtime**: Java 22 (recomendado) o Java 21+.
- **Persistencia**: R2DBC (drivers reactivos) para PostgreSQL.
- **Seguridad**: JwtAuth con HS512.
- **Protocolos**: REST (JSON) + RSocket (Battle Core).

---

## 2. Refactorización UUID (Crítico)
Para garantizar la compatibilidad nativa con **Supabase Auth**, todos los identificadores de usuario y entidades principales han sido migrados a `UUID`.

**Ejemplo de Entidad:**
```java
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Table("users")
public class User {
    @Id
    private UUID id;
    private String email;
    private String name;
    private Integer level;
    // ...
}
```

---

## 3. Estructura de Endpoints Requerida
El cliente móvil espera las siguientes rutas bajo `/api`:

| Categoría | Ruta | Descripción |
|---|---|---|
| **Auth** | `/auth/login` | Recibe email/pass, devuelve JWT + User info |
| **Colección** | `/collection` | GET de aves del usuario autenticado |
| **Expedición** | `/expeditions/start` | POST para registrar inicio de ruta |
| **Batalla** | `/battle/attack` | Endpoint reactivo para procesar daño |

---

## 4. Configuración del Servidor (Lubuntu)
El servidor debe escuchar en la interfaz de **Tailscale** (`100.112.239.82`) para ser accesible desde la App.

**application.yml:**
```yaml
server:
  port: 8080
  address: 0.0.0.0

spring:
  r2dbc:
    url: r2dbc:postgresql://[SUPABASE_HOST]:5432/postgres
    username: postgres
    password: [PASSWORD]
```

---

## 5. Próximos Pasos para Backend
1. **Migración a Spring Boot 4**: Asegurar que las dependencias de Jakarta EE sustituyen a las de J2EE.
2. **WebFlux**: Mantener el flujo no bloqueante para soportar las expediciones concurrentes de múltiples usuarios.
3. **Logs**: Configurar `journalctl` para el servicio `avis-backend` para facilitar el debug remoto vía SSH.

---
*Documentación generada automáticamente para sincronización de equipo.*
