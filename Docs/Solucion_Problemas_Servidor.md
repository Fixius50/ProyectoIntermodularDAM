# 🛠️ Solución de Problemas del Servidor (Backend)

Este documento recopila los errores comunes y sus soluciones para el mantenimiento del servidor de AVIS.

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

---
*Para ver logs en tiempo real: `sudo journalctl -u avisserver.service -f`*
