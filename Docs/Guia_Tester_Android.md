# 🧪 Guía para Testers de Android - AVIS

Esta guía explica los pasos necesarios para configurar el entorno de red y comenzar a testear la aplicación **AVIS** en dispositivos Android.

## 1. Instalación de Tailscale

Para que la aplicación pueda comunicarse con nuestro servidor remoto (Lubuntu), es **imprescindible** estar dentro de nuestra red privada.

1.  Descarga e instala la aplicación **Tailscale** desde la [Google Play Store](https://play.google.com/store/apps/details?id=com.tailscale.ipn).
2.  Abre la aplicación Tailscale.
3.  Inicia sesión con las siguientes credenciales (Cuenta Maestra de Testeo):
    -   **Correo:** `tailscaletfg@gmail.com`
    -   **Contraseña:** `Mbba6121.`
4.  Una vez iniciada la sesión, pulsa el interruptor para poner el estado en **"Active"** o **"Connected"**.
5.  Verifica que ves en la lista el dispositivo: `lubuntu-virtualbox` (IP: `100.112.94.34`).

## 2. Ejecución de la App Avis

Una vez que Tailscale esté conectado:

1.  Instala el archivo `.apk` de la aplicación AVIS proporcionado.
2.  Al abrir la app, verás un mensaje de "Iniciando Tailscale" (si usas la versión con bridge integrado) o simplemente la pantalla de Login.
3.  Si la red está bien configurada, podrás registrarte o iniciar sesión.

## 3. Resolución de Problemas (FAQ)

-   **"Failed to fetch" o Error de Conexión:**
    -   Asegúrate de que la app oficial de Tailscale esté conectada.
    -   Verifica que tienes internet en el móvil.
-   **La app se queda en blanco al arrancar:**
    -   Cierra la app por completo y vuelve a abrirla.
    -   Comprueba que el servidor no esté en mantenimiento.

---
*Nota: Esta red es privada y solo para propósitos de desarrollo y testeo del TFG.*
