5. Infraestructura de Red: VPN Peer-to-Peer (Tailscale)
Para garantizar que los dispositivos móviles (Android) puedan comunicarse de manera segura y directa con el servidor local (Lubuntu) durante las fases de desarrollo y la presentación final del TFG, se ha implementado una red virtual privada basada en WireGuard mediante Tailscale.

5.1. Justificación Arquitectónica
El uso de esta Tailnet resuelve dos problemas críticos del proyecto:

Evasión de NAT/Firewalls: Permite esquivar las restricciones de red, puertos cerrados y aislamiento de clientes típicos de las redes Wi-Fi institucionales (institutos/universidades).

Seguridad del Modelo de IA: Mantiene el procesamiento de los modelos locales pesados (.gguf) aislado y seguro dentro del servidor Lubuntu, exponiendo únicamente los endpoints necesarios a través del túnel cifrado.

5.2. Script de Autoconfiguración y Despliegue (auth_tailscale.sh)
Para automatizar el alta del servidor en la red virtual, se ha creado un script Bash en la ruta /home/lubuntu/auth_tailscale.sh que utiliza una Auth Key estática.

Código del script:

Bash
#!/bin/bash

# ==========================================
# Script de Autenticación y Autoarranque de Tailscale
# Proyecto AVIS - TFG
# ==========================================

# Clave de autorización del proyecto (Precaución: No exponer en repositorios públicos)
TAILSCALE_AUTH_KEY="tskey-auth-k4cntXLUiW11CNTRL-ZriLhcmNRY6WHVTap15NZ6ygQTDoJY4o"

echo "Autenticando el servidor en la Tailnet de AVIS..."

# 1. Levantar Tailscale usando la Auth Key de forma desatendida
sudo tailscale up --authkey=${TAILSCALE_AUTH_KEY}

# 2. Habilitar el demonio en systemd
sudo systemctl enable --now tailscaled

echo "=========================================="
echo "✅ Tailscale autenticado y configurado con éxito."
echo "La IP virtual estática del servidor backend es:"
tailscale ip -4
echo "=========================================="
Permisos de ejecución:

Bash
chmod +x /home/lubuntu/auth_tailscale.sh
5.3. Resiliencia y Autoarranque (Crontab)
Para que el servidor sea el gestor autónomo del flujo del juego, debe ser tolerante a caídas de red o cortes de energía. Se ha configurado el programador de tareas del sistema (cron) para ejecutar el script de conexión automáticamente en cada inicio, antes de que el usuario inicie sesión.

Configuración en el servidor (Lubuntu):

Abrir el editor de tareas del superusuario:

Bash
sudo crontab -e
Añadir la directiva de ejecución al final del archivo:

Bash
@reboot /home/lubuntu/auth_tailscale.sh
Esto garantiza que, tras cualquier reinicio físico, el túnel VPN se levante en segundo plano al instante, manteniendo la misma IP virtual asignada (100.x.x.x).

5.4. Configuración en Dispositivos Cliente (Android)
Para que los jugadores puedan acceder al juego:

Instalar la aplicación oficial de Tailscale desde Google Play.

Iniciar sesión con la cuenta de administración del proyecto.

Activar el interruptor de conexión VPN en la app.

El dispositivo Android se conectará instantáneamente a la misma red de área local virtual (VLAN) que el servidor Lubuntu.

5.5. Integración en el Frontend
Dentro del código de la aplicación móvil (React Native/Flutter), las variables de entorno apuntan directamente a la IP estática del túnel Tailscale en lugar de a localhost:

JavaScript
// Configuración de red para el cliente Android
const SERVER_IP = "100.x.x.x"; // Sustituir por la IP asignada a Lubuntu 100.112.239.82
const API_REST_URL = `http://${SERVER_IP}:8080/api`;
const RSOCKET_URL = `ws://${SERVER_IP}:7000/rsocket`;
