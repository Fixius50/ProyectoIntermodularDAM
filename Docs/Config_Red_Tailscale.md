# Configuración de Red y Credenciales de Tailscale - AVIS

Este documento detalla la infraestructura de red privada y las credenciales maestras utilizadas para la comunicación entre el cliente móvil y el servidor backend.

## 🌐 Direccionamiento IP y Puertos

La aplicación utiliza un sistema de detección dinámica para elegir la mejor ruta de conexión:

| Entorno | Dirección IP | Puerto | Descripción |
| :--- | :--- | :--- | :--- |
| **Producción (Tailscale)** | `100.112.94.34` | `8080` | IP directa asignada en la Tailnet del TFG. |
| **Emulador Android** | `10.0.2.2` | `8080` | Redirección automática al host local del PC. |
| **Puente Local (Go)** | `127.0.0.1` | `1055` | Puerto del Proxy Inverso interno (cuando no hay app oficial). |
| **Web Local** | `localhost` | `8080` | Entorno de desarrollo en navegador. |

> [!IMPORTANT]
> Todas las peticiones a la API deben usar el puerto **8080** cuando se dirigen al backend (ya sea vía Tailscale o directa).

## 🔑 Credenciales Maestras (Fijas)

Para garantizar la conectividad de todos los clientes sin depender de configuraciones individuales, se han establecido las siguientes credenciales para el paquete de red:

- **Usuario de Tailscale**: `tailscaletfg@gmail.com`
- **Contraseña de Tailscale**: `Mbba6121.`
- **AuthKey (Bootstrap)**: `tskey-auth-ksLaC6orfS11CNTRL-bbsStJGyQKfroV59uBd9Kf6kH9bRZzQpX`

### Uso de Nombres de Host (Hostnames)
Los dispositivos se identifican en el panel de Tailscale siguiendo el patrón:
`tailscaletfg-gmail-com-[nombre_usuario]`

## 🛠️ Componentes de Red Involucrados

1.  **`api.ts`**: Gestiona la lógica de detección `getBaseUrl()`.
2.  **`NetworkModule.java`**: Interceptor nativo que inyecta el JWT y redirige el tráfico en Android.
3.  **`tailscalebridge.go`**: Binario Go que actúa como Proxy Inverso HTTP cuando no está la app oficial de Tailscale instalada.
4.  **`network_security_config.xml`**: Permite el tráfico cleartext para las IPs arriba mencionadas.

---
*Última actualización: 2026-03-01*
