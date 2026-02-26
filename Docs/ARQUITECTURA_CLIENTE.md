# Arquitectura Híbrida del Cliente (Avis)

Este documento describe la estructura y decisiones técnicas para el desarrollo del Cliente de Avis.

## 1. Patrón Híbrido (PWA + Nativo)
El cliente aprovecha un diseño Web/PWA existente (desarrollado con Vite, Tailwind u otras tecnologías web locales) contenido en la carpeta base `Cliente/`. Para convertir este diseño en una aplicación móvil, utilizamos **Capacitor**.

Capacitor inyecta este Frontend dentro de un `WebView` en Android, lo que nos permite mantener la misma UI en cualquier plataforma, pero dándonos acceso íntegro a la plataforma móvil nativa.

## 2. Inyección de Código Nativo Android (`android/`)
Para tareas intensivas, que requieren procesamiento en segundo plano firme o persistencia compleja, **abandonamos las librerías web (JS)** en favor de los estándares nativos de Android Puro. Esta lógica residirá en la carpeta generada por Capacitor (`Cliente/android/app/src/main/java/...`).

Se integrarán las siguientes tecnologías exigidas por diseño:
* **Retrofit2 + Gson:** Para conectar al Backend Spring Boot. Eficiente, tolerante a fallos de red y fácilmente conectable a la capa Reactiva.
* **RxJava 3:** Todas las operaciones de red (Retrofit) y base de datos local no deben bloquear la Interfaz de Capacitor. Se ejecutarán en hilos RxJava (`Schedulers.io()`).
* **Room Database:** Base de datos offline basada en SQLite para guardar tu inventario capturado de pájaros si no tienes internet.
* **WorkManager:** Los registros de ataques, capturas de aves offline, etc. se sincronizarán mediante tareas garantizadas en el background.
* **Dagger - Hilt:** Proveerá de forma inyectada las interfaces de Retrofit y el DAO de Room al resto de la App sin instanciaciones manuales complejas.
* **LocationServices (FusedLocationProvider):** Interfaz nativa de los servicios de Google Play para obtener el GPS del móvil en las mecánicas de captura sin drenar la batería (mejor que la Web Geolocation API).
* **OkHttp WebSockets:** Se ocupará del canal en tiempo real en la Arena/Batalla para conectarse con el RSocket/RabbitMQ del servidor.
* **EncryptedSharedPreferences:** Archivo XML seguro/cifrado para albergar el Token JWT emitido por Spring Boot.

## 3. Flujo de Trabajo
1. El UI (botones, menús, mapas) se renderiza en HTML/JS en el WebView.
2. Al pulsar un botón complejo (ej. "Atacar" o "Sincronizar BBDD"), la comunicación salta al Puente de Capacitor invocando a un Plugin personalizado en Java.
3. El Plugin de Java ejecuta `Retrofit` o `Room` usando `RxJava` nativo.
4. El resultado vuelve asíncronamente a JavaScript para pintar el resultado visualmente en PWA.
