# 05 Bitácora Dev

## Registro de Errores y Soluciones

### Error: Incompatible React versions (react vs react-dom)

**Fecha:** 2026-02-23
**Contexto:** Al configurar React Native Web con Vite e instalar `react-dom` sin especificar versión.
**Síntoma:** Pantalla blanca en `localhost:5173`. En la consola del navegador aparece:

```text
Uncaught Error: Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:
- react: 19.2.3
- react-dom: 19.2.4
```

**Causa:** El proyecto base de React Native venía con `react@19.2.3`. Al instalar `react-dom` mediante `npm install react-dom`, npm descargó la última versión disponible (`19.2.4`), causando una discrepancia estricta exigida por React.
**Solución:** Forzar la re-instalación explícita de ambas librerías en la misma versión exacta usando:
`npm install react@19.2.3 react-dom@19.2.3 --legacy-peer-deps`

### Error: Pantalla en blanco ("Element type is invalid: expected a string but got: object")

**Fecha:** 2026-02-24
**Contexto:** Montaje del punto de entrada en web (`index.web.js`) en React Native Web usando Vite.
**Síntoma:** Compila correctamente (exit 0), pero al abrir en localhost muestra una pantalla en blanco. En la consola del navegador salta el error: `Uncaught Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.`
**Causa:** Conflicto de resolución de módulos de Vite al faltar la extensión explícita. El archivo `index.web.js` contenía `import App from './App'`. Al existir tanto `App.tsx` (el componente) como `app.json` (configuración) en el mismo nivel, Vite resolvía e importaba `app.json` en lugar de `App.tsx`. Esto pasó a React un objeto JSON puro (con configuración) en lugar de un React Node válido, provocando el fallo de render.
**Solución:** Modificar la importación en `index.web.js` para exigir explícitamente la extensión: `import App from './App.tsx'`.

### Refactorización UUID y Configuración IDE (Backend)

**Fecha:** 2026-02-24
**Contexto:** Preparación del modelo de datos de Spring Boot para integrarse con Supabase Auth y base de datos, además de fallos de compilación con la extensión de Java de Visual Studio Code.
**Síntoma:** El IDE marcaba en rojo todas las clases Java indicando "No se encuentra el paquete `java.lang.String`" o dependencias externas ignoradas, aunque por comando la compilación `mvn clean compile` era exitosa.
**Causa:** El editor abría la carpeta raíz del proyecto (`ProyectoIntermodularDAM`), pero el proyecto Maven real estaba anidado dentro de la carpeta `src/backend`. El servidor de lenguaje Java se desorientaba al no encontrar ningún `pom.xml` en la raíz que declarara los módulos.
**Solución:**
1.  **Refactorización del Modelo (`Long` a `UUID`):** Todas las entidades, DTOs y controladores (`BattleSession`, `AuctionItem`, `MarketplaceController`, etc.) ahora usan el tipo `UUID` (en lugar de `Long` autoincremental simulación H2) para emparejarse con el sistema nativo de identidades de Supabase.
2.  **POM Agregador:** Se creó un archivo `pom.xml` en la carpeta raíz (`ProyectoIntermodularDAM/pom.xml`) de tipo `packaging: pom` apuntando al submódulo `<module>src/backend</module>`. Esto resolvió la detección automática de Java en VS Code.

### Error: Backend inaccesible desde IP de Tailscale (Timeout)

**Fecha:** 2026-02-24
**Contexto:** Despliegue en desarrollo de Endpoints de Spring Boot (`8080`) e intento de conectar el cliente móvil vía proxy de Tailscale (`http://100.112.239.82:8080/api/auth/login`).
**Síntoma:** Al lanzar una petición cURL o probar con el frontend contra la IP de Tailscale, la conexión fallaba tras 21 segundos por `Timeout` (Failed to connect). Localmente (en `localhost:8080` sí devolvía `401 Unauthorized` correctamente según la lógica interna de la API REST).
**Causa:** Spring Boot por defecto `server.address` lo adhiere limitadamente. Pero sobre todo, el cortafuegos perimetral del PC (Firewall de Windows) bloqueaba automáticamente las conexiones TCP entrantes al puerto 8080 originadas desde la subred de la tarjeta de red virtual creada por Tailscale.
**Solución:**
1.  **En `application.yml`**: Configurada globalmente a `server.address: 0.0.0.0` para obligar a Spring Boot a escuchar indiscriminadamente en todos los adaptadores de red de la máquina huésped (incluido Tailscale).
2.  **Firewall de Windows**: Configurar explícitamente una nueva Regla de Entrada en `wf.msc` permitiendo tráfico concurrente `TCP 8080` a perfiles públicos/privados generados por la interfaz del túnel VPN de Tailscale.

### Acceso Remoto al Servidor (Pruebas y Logs)

**Fecha:** 2026-02-24
**Contexto:** Necesidad de verificar archivos generados por el backend (por ejemplo, \pruebaConexion.txt\) en el servidor remoto Lubuntu durante el testing.
**Procedimiento:**
Dado que el servidor est� conectado a la Tailnet (IP \100.112.239.82\), se puede acceder de forma segura y directa por SSH desde cualquier equipo de desarrollo autorizado, sin lidiar con redirecci�n de puertos del router.

1.  **Conexi�n SSH v�a Tailscale:**
    Para entrar al servidor y tener interactividad total:
    \ssh lubuntu@100.112.239.82\
    *(Se solicitar� la contrase�a del usuario \lubuntu\, que actualmente es \Mbba6121.\)*.

2.  **B�squeda y Lectura R�pida de Archivos V�a SSH:**
    Si solo se desea buscar un archivo de prueba (ej. \pruebaConexion.txt\) y volcar su contenido directamente en la terminal local sin abrir una sesi�n interactiva, se puede pasar el comando directamente:
    \ssh lubuntu@100.112.239.82 "find /home/lubuntu -name pruebaConexion.txt -type f -exec cat {} + "\

**Nota T�cnica (Troubleshooting):** Si tras iniciar el t�nel \	ailscale up\ localmente los endpoints \http://100.112.239.82:8080/...\ arrojan Timeout, pero por SSH el acceso es correcto, el problema reside en la **ausencia del servicio Spring Boot** levantado en el servidor remoto, o que el Firewall UFW de Lubuntu est� bloqueando el puerto 8080.
