# 09 Conectividad Tailscale (Go Bridge)

Este documento describe la arquitectura de red utilizada para conectar la aplicación Android con el servidor Backend remoto (Lubuntu) de forma segura a través de una red privada virtual (VPN).

## Arquitectura de Conexión

Debido a que Tailscale no puede integrarse como una VPN de sistema tradicional en Android sin permisos de root o configuración de usuario, utilizamos `tsnet` (Tailscale-in-a-library).

### Flujo de Datos
1. **Frontend (Capacitor/React)**: Realiza llamadas API a través de `AvisCore` / `Hilt`.
2. **Android (OkHttp)**: Configurado con un Proxy SOCKS5 apuntando a `127.0.0.1:1055`.
3. **Go Bridge (`tailscalebridge.aar`)**:
    - Levanta un nodo de Tailscale en el espacio de usuario de la app.
    - Expone un servidor SOCKS5 real (`armon/go-socks5`).
    - Utiliza el Dialer de Tailscale para encaminar el tráfico del proxy hacia la red privada.
4. **Red Tailscale**: El tráfico viaja cifrado de punto a punto hasta el servidor.
5. **Servidor (Lubuntu)**: Recibe la petición en el puerto 8080 (Spring Boot).

## Componentes Técnicos

### 1. El Bridge de Go (`tailscalebridge.go`)
Ubicación: `tailscalebridge/`

**Pase de Red (Bypass de Netlink)**: 
Para evitar errores de `permission denied` en Android, el bridge desactiva la monitorización de red del sistema:
```go
func init() {
    os.Setenv("TS_NO_NETLINK", "true")
    os.Setenv("TS_DEBUG_NO_NETLINK", "true")
}
```

**Servidor SOCKS5**:
Utiliza el dialer interno del servidor tsnet:
```go
conf := &socks5.Config{
    Dial: func(ctx context.Context, network, addr string) (net.Conn, error) {
        return tsServer.Dial(ctx, network, addr)
    },
}
```

### 2. Plugin de Capacitor (`TailscalePlugin.java`)
Actúa como puente entre JavaScript y los binarios de Go.
- `initTailscale(authKey, hostname)`: Arranca el nodo.
- `testConnection(url)`: Realiza una prueba de salud desde el propio bridge.

### 3. Configuración de OkHttp (`NetworkModule.java`)
Configuración del proxy en el cliente HTTP del sistema Android:
```java
java.net.Proxy proxy = new java.net.Proxy(java.net.Proxy.Type.SOCKS, 
        new java.net.InetSocketAddress("127.0.0.1", 1055));

return new OkHttpClient.Builder()
        .proxy(proxy)
        .build();
```

## Solución de Problemas Comunes

- **Tailscale no aparece en el Panel**: Verifica que la `AuthKey` sea válida y que el dispositivo tenga acceso a internet.
- **Error "Permission Denied" (Netlink)**: Asegúrate de que el bridge se haya compilado con las variables de entorno de bypass en el `init()`.
- **Mixed Content Error**: La WebView debe configurarse con `androidScheme: 'http'` para permitir llamadas a IPs locales desde un origen no seguro pero controlado.

## Compilación del Bridge
Si se realizan cambios en el código Go, se debe regenerar el archivo `.aar`:
```powershell
cd tailscalebridge
.\build_aar.ps1
```
