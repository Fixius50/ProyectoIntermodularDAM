# Informe de Tecnologías y Dependencias: Aery App (Android Nativo - Java)

Para portar **Aery**, un cuaderno de campo interactivo gamificado (Santuario, Expedición, Certamen, Social, Tienda), a una **Aplicación Nativa de Android usando Java**, será necesario adoptar un ecosistema moderno pero consolidado sobre el lenguaje Java. A continuación se desglosan las librerías, dependencias de Gradle y componentes arquitectónicos recomendados.

---

## 🏗️ 1. Arquitectura Base (Android Jetpack)
Dado que la aplicación depende fuertemente de los estados (pájaros activos, clima en vivo, chat en tiempo real), el patrón arquitectónico ideal es **MVVM (Model-View-ViewModel)**.

*   **Lifecycle, ViewModel y LiveData**: Para mantener los datos de la UI consistentes durante rotaciones de pantalla o cambios de ciclo de vida.
    ```gradle
    implementation 'androidx.lifecycle:lifecycle-viewmodel:2.8.2'
    implementation 'androidx.lifecycle:lifecycle-livedata:2.8.2'
    ```
*   **Navigation Component**: Para manejar la barra de navegación inferior (BottomNavigationView) y el salto entre fragmentos (Santuario -> Tienda, etc.) de manera fluida y declarativa.
    ```gradle
    implementation 'androidx.navigation:navigation-fragment:2.7.7'
    implementation 'androidx.navigation:navigation-ui:2.7.7'
    ```

---

## 🎨 2. Interfaz de Usuario (UI/UX)
La aplicación web actual tiene un diseño "glassmorphism", transiciones suaves y componentes estilizados (Tailwind). En Android Nativo se requiere emplear **Material Design 3** y bibliotecas de UI potentes.

*   **Material Components para Android**: Para BottomNavigation, Cards, Botones estilizados flotantes y diálogos (modales).
    ```gradle
    implementation 'com.google.android.material:material:1.12.0'
    ```
*   **ConstraintLayout**: Obligatorio para diseñar vistas complejas como la pantalla de *Certamen* sin anidar linear layouts.
    ```gradle
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    ```
*   **Glide** o **Picasso**: Para la carga asíncrona en memoria y en caché de todas las imágenes (avatares de usuarios, los banners del álbum y los pájaros en el Santuario).
    ```gradle
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    annotationProcessor 'com.github.bumptech.glide:compiler:4.16.0'
    ```
*   **Lottie (opcional pero recomendado)**: Para trasladar las animaciones sutiles (el clima, las animaciones al combatir en el Certamen).
    ```gradle
    implementation 'com.airbnb.android:lottie:6.4.0'
    ```

---

## 💾 3. Persistencia de Datos y Caché Local
Aery web utiliza `localStorage`. En la app final se dependerá del backend, pero es vital cachear datos (álbum completo, pájaros obtenidos) para soporte *offline*.

*   **Room Database**: El ORM oficial de Google sobre SQLite. Permite almacenar el inventario y aves del usuario localmente, y usar LiveData para actualizar la UI cuando cambian.
    ```gradle
    implementation 'androidx.room:room-runtime:2.6.1'
    annotationProcessor 'androidx.room:room-compiler:2.6.1'
    ```
*   **SharedPreferences / DataStore**: Para pequeños tokens (el usuario logueado, configuraciones de sonido).

---

## 🌐 4. Comunicaciones de Red (REST y WebSockets)
Dado que el Certamen será multijugador y habrá chat de Bandada, la red es el núcleo del cliente Android.

*   **Retrofit (con GSON o Jackson)**: La librería estándar de oro para conectar con las Endpoints REST de Spring Boot (Inicio de sesión, obtener el perfil, adquirir objetos de progreso).
    ```gradle
    implementation 'com.squareup.retrofit2:retrofit:2.11.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.11.0'
    ```
*   **OkHttp3**: Cliente HTTP base, usado para interceptar peticiones y añadir el token `Bearer` de autorización del usuario.
    ```gradle
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'
    ```
*   **STOMP Protocol over WebSockets**: Para conectarse a los WebSockets de Spring Boot. Spring utiliza habitualmente STOMP. Librerías de STOMP para Android Java son esenciales para el modo **Arena (Batalla por turnos)** y el **Chat Grupal**.
    ```gradle
    implementation 'com.github.NaikSoftware:StompProtocolAndroid:1.6.6'
    // RxJava dependería de la implementación de STOMP, si lo requiere la librería.
    implementation 'io.reactivex.rxjava2:rxjava:2.2.21'
    implementation 'io.reactivex.rxjava2:rxandroid:2.1.1'
    ```

---

## 🗺️ 5. Servicios de Ubicación y Funcionalidades Nativas
Aery utiliza el clima y, conceptualmente, la localización en la *Red Social Local 'Pinto'* y la búsqueda de Expedición.

*   **Google Play Services - Location**: Para recuperar las coordenadas geográficas reales del jugador y consultar la API del clima antes de enviar la expedición.
    ```gradle
    implementation 'com.google.android.gms:play-services-location:21.2.0'
    ```
*   **Reproducción de Sonido Externa**: No requiere librería extra. Mediante las clases nativas de Java `MediaPlayer` integradas en Android (`android.media.MediaPlayer`) vas a reproducir los cantos del catálogo aviar y la música de fondo.

---

## Plan Práctico de Migración
Si tuvieras que empezar **hoy** en Android Studio:
1. **Paso Inicial**: Iniciar un proyecto *Empty Views Activity* (en Java no Compose, aunque si lo deseas se podría usar Kotlin/Compose como norma en la industria).
2. **Setup Base de Datos y API**: Construir las entidades de **Room** de todo el `state.ts` (pájaros, usuario, posts del feed) y el repositorio Retrofit.
3. **Fragmentos Core**: Desarrollar los 5 fragments correspondientes al menú inferior (HomeFragment, AlbumFragment, ArenaFragment, ExpeditionFragment, SocialFragment) y unirlos con Jetpack Navigation Graph.
4. **Acoplar los WebSockets**: A traves de STOMP, construir la lógica reactiva en el `ArenaViewModel` para enviar tu ataque al servidor de Spring Boot y recibir la orden de la animación de victoria o derrota.

---

## 📱 6. Guía Paso a Paso: Implementación y Adaptación de la Interfaz a Pantallas Móviles

Convertir un diseño web interactivo (como el actual de Aery) a una aplicación móvil nativa requiere aprovechar los sistemas de Layout de Android para garantizar que se adapte a cualquier tamaño de pantalla (desde teléfonos pequeños hasta tablets).

### Paso 1: Configurar el Contenedor Principal y la Navegación (Bottom Navigation)
*   En tu `activity_main.xml`, crea un `ConstraintLayout` como raíz.
*   Añade un `FragmentContainerView` que ocupe el resto de la pantalla superior. Este será el contenedor donde se inyecten las pantallas usando Jetpack Navigation.
*   En la parte inferior, añade un `BottomNavigationView` de Material Design. 
*   **Adaptación móvil**: En pantallas táctiles, los menús de navegación deben estar en la parte inferior para que sean accesibles con los pulgares. Configura iconos de Material (Iconos de pluma, pájaro, etc) para cada pestaña.

### Paso 2: Diseño de Pantallas basado en ConstraintLayout y ScrollViews
*   **Para pantallas largas (Santuario / Tienda)**: Envuelve el contenido de tus Fragments dentro de un `NestedScrollView`. Esto asegura que el usuario pueda deslizar hacia abajo si su pantalla es muy pequeña.
*   **Uso intensivo de ConstraintLayout**: El diseño tipo "Glassmorphism" y las tarjetas apiladas de Aery requieren capas. Usa `ConstraintLayout` en cada Fragment (por ejemplo, `fragment_home.xml`) para posicionar elementos uno encima del otro (como la imagen de fondo del árbol, el filtro oscurecedor y los botones de los pájaros encima).

### Paso 3: Tipografía, Colores y Temas Dinámicos (Day/Night Mode)
*   Define tus colores base (Cream, Slate, Primary, Sage) en `res/values/colors.xml`.
*   Crea un archivo alternativo `res/values-night/colors.xml` para el **Modo Oscuro** (Dark Mode). Android cambiará la paleta de colores automáticamente según la configuración del sistema del usuario, logrando el mismo efecto de oscurecimiento que tenemos en la web.
*   Importa las fuentes personalizadas (como 'Outfit' o 'Inter') a la carpeta `res/font` y aplícalas globalmente en tu `themes.xml`.

### Paso 4: Tarjetas (CardViews) y Efectos Visuales
*   Utiliza `MaterialCardView` para replicar el estilo de las cajas de cristal o los paneles redondeados. 
*   Configura propiedades como `app:cardCornerRadius="24dp"` y `app:cardElevation="8dp"` para lograr el aspecto "flotante" elegante que tiene el diseño web.
*   Para replicar el "Glassmorphism" de forma nativa en Android, puedes aplicar fondos semi-transparentes o librerías específicas como `BlurView` si necesitas un difuminado real en tiempo real.

### Paso 5: Listas Eficientes con RecyclerView
*   **El Álbum y la Tienda**: En lugar de renderizar todas las cartas de golpe como en la web, implementa un `RecyclerView` con un `GridLayoutManager` (de 2 a 3 columnas, dependiendo del ancho del dispositivo).
*   **Adaptabilidad**: El `RecyclerView` recicla las vistas, lo que hace que navegar por cientos de aves en tu álbum no sature la memoria del móvil.
*   Crea un diseño XML individual (ej. `item_bird_card.xml`) para lo que sería una sola carta y reutilízalo.

### Paso 6: Animaciones y Microinteracciones
*   Para que la experiencia no sea rígida, utiliza animaciones de entrada nativas (Transiciones Compartidas - *Shared Element Transitions*) al hacer clic en un pájaro de tu lista para ver su detalle en pantalla completa.
*   Los efectos climáticos (lluvia, hojas cayendo) o el aleteo en el modo *Certamen* se implementan idealmente exportando tus animaciones con **Lottie** (archivos `.json` generados desde After Effects). Usa `LottieAnimationView` para reproducirlas con cero impacto en el rendimiento.
