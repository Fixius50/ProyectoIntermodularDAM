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

# 🛠️ Solución de Problemas del Servidor (Backend)

## 1. Error: "Connection Refused" (Puerto 5432 o 6543)

**Síntoma:** El servidor arranca pero falla al realizar cualquier operación de base de datos (Error 500).
**Causa:** Incompatibilidad con IPv6 en la red de la VM o bloqueo de firewall.
**Solución:**
-   Asegúrate de que `application.yml` usa el puerto **6543** (Connection Pooler de Supabase).
-   Si persiste, añade `-Djava.net.preferIPv4Stack=true` al arrancar el jar:
    ```bash
    java -Djava.net.preferIPv4Stack=true -jar server-target.jar
    ```

## 2. El servidor no refleja los cambios de código

**Síntoma:** Has modificado el código pero el log muestra comportamientos antiguos.
**Causa:** El proceso de Java no se detuvo correctamente o no se recompiló el .jar.
**Solución:**
1.  Busca el proceso antiguo: `ps aux | grep java`
2.  Mátalo: `sudo kill -9 <PID>`
3.  Recompila: `mvn clean package -DskipTests`
4.  Reinicia el servicio: `sudo systemctl restart avisserver.service`

## 3. Tailscale no conecta en el servidor

**Síntoma:** Los clientes Android no pueden llegar a la IP `100.112.94.34`.
**Causa:** El servicio de Tailscale en Lubuntu está caído o desautenticado.
**Solución:**
-   Comprueba el estado: `tailscale status`
-   Si está desconectado: `tailscale up --authkey <TU_KEY>`

## 4. Error de RabbitMQ/Redis

**Síntoma:** Errores de "Connection failure" al inicio del servidor.
**Causa:** Los servicios de RabbitMQ o Redis no están corriendo.
**Solución:**
-   `sudo systemctl start rabbitmq-server`
-   `sudo systemctl start redis-server`
