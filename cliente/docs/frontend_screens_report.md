# Clase: ElCertamen (`ElCertamen.tsx`)

## PropÃ³sito General
Representa un mini-juego de combate de cartas/atributos ("Auto-battler"). Enfrenta al pÃ¡jaro del jugador contra un pÃ¡jaro rival generado procedimentalmente basÃ¡ndose en un atributo activo: Canto, Plumaje o Vuelo.

## Dependencias Clave
- **Estado Global:** `useAppStore` para `playerBirds`, `inventory`, consumibles en tiempo real y logs de batallas. Necesita `updateStamina`, `completeBattle`.
- **ImÃ¡genes Externas:** Utiliza `fetchBirdImage` para obtener la foto del rival.

## MÃ¡quina de Estados (Fases)
El componente se mueve por una variable de estado `phase`:
1. `selection`: Eliges un pÃ¡jaro de tu inventario (`playerBirds`). Revisa si el ave tiene mÃ¡s de 20 de "Stamina", si no, no puede luchar.
2. `preparation`: Comparas tu pÃ¡jaro con el rival (`generateOpponent`). Puedes equipar un `consumable` temporal que aplique bufos (ventajas estadÃ­sticas).
3. `combat`: Juegas al mejor de 5 rondas.
4. `rewards`: Recoges ganancias en plumas y experiencia, y retornas a Home.

## Flujo de CÃ³digo Importante: `calculateRound`
El nÃºcleo matemÃ¡tico reside en la funciÃ³n `calculateRound`:
1. **ElecciÃ³n AutomÃ¡tica Rival:** El ordenador elige al azar si atacar con canto, plumaje o vuelo.
2. **Combos:** Si el jugador gana la ronda actual con un atributo distinto a la anterior ronda, su multiplicador de combo sube (`comboCount`).
3. **TriÃ¡ngulo de Arma:** Canto gana a Plumaje, Plumaje a Vuelo, Vuelo a Canto (Multiplicador de 1.3x).
4. **Clima y Hora:** 
   - MaÃ±ana incrementa `Canto`.
   - Lluvia mejora `Plumaje`.
   - Viento despejado sube `Vuelo`.
5. **Habilidad Especial:** Diferente segÃºn el tipo/clasificaciÃ³n de tu pÃ¡jaro (Raptor baja atributos rivales, Songbird aumenta masivamente el tuyo propio).

## Modificadores Visuales
Durante el combate, tras comparar atributos, se dispara una variable `isAnimating` durante 2 segundos y se drena 4 puntos de *Stamina*. Los progresos (puntos en azul o rojo) y logs se aculan en tarjetas inferiores de cristal (`GlassPanel`).
# Clase: LaExpediciÃ³n (`LaExpedicion.tsx`)

## PropÃ³sito General
ActÃºa como la ventana al mundo externo del jugador. Incluye un mapa (renderizado mediante librerÃ­as externas o capas CSS dinÃ¡micas) para buscar, descubrir y atrapar ejemplares en distintas ubicaciones del ecosistema virtual o real (mediante mock de coordenadas GPS en `AvisCore`).

## Dependencias Clave
- **LibrerÃ­a CartogrÃ¡fica:** Uso de `leaflet` y `react-leaflet` para renderizar mosaicos (`TileLayer`), marcadores y vistas (`MapContainer`). Reacciona al tamaÃ±o de pantalla.
- **Plugins Nativos:** InteractÃºa potencialmente con la posiciÃ³n real si se permite la integraciÃ³n GPS en plugins. Carga iconos personalizados (L.icon).

## LÃ³gica Fundamental
El sistema funciona a base de radares o temporizadores de enfriamiento (Cooldowns).
1. **Radar (`handleScan`):**
   - El escaneo cuesta tiempo o se hace de gratis cada X minutos usando una variable de estado (`scanCooldown`).
   - El escaneo revisa el clima de hoy (`weather?.condition`) y la fase horaria (`time.phase`). SÃ³lo los pÃ¡jaros cuyo `preferredWeather` concuerden con las mÃ©tricas serÃ¡n instanciados y colocados al azar alrededor de las coordenadas origen del usuario.
2. **Uso de PrismÃ¡ticos (`handleUseBinoculars`):**
   - Si el jugador gasta un Ã­tem (i5), el temporizador se reinicia de golpe, logrando escanear instantÃ¡neamente y colocando marcadores en el mapa.

## Modales de Captura
Cuando haces clic a un Marcador en el mapa foliar (`Marker` prop), se abre un modal inferior `StudyModal`. En Ã©l se ve la biografÃ­a del ejemplar. Si el jugador le da a "Registrar Avistamiento", se disparan las funciones del Store (`useAppStore.captureBird`) que agregan la entidad a la colecciÃ³n local del jugador.

## Cambios DinÃ¡micos Visuales
El estilo del mapa (`TileLayer url`) pivota entre una textura CartoDB Light o Dark basÃ¡ndose en si el `theme` del usuario (guardado globalmente) es 'light' u 'dark'. Evita asÃ­ romper la cohesiÃ³n visual del resto de componentes de cristal.
# Clase: Login (`Login.tsx`)

## PropÃ³sito General
La clase `Login.tsx` es el punto de entrada a la aplicaciÃ³n principal para usuarios no autenticados. Gestiona la autenticaciÃ³n biomÃ©trica/credenciales, el registro de nuevas cuentas y proporciona una opciÃ³n de entorno de pruebas (Test Login).

## Dependencias Clave
- **Estado Global:** `useAppStore` para extraer `login`, `register`, `language`, `setLanguage`, `testLogin`.
- **UI:** Renderiza componentes compartidos como `GlassPanel` e incluye logotipos e iconos.
- **TraducciÃ³n:** Utiliza el objeto `translations` para internacionalizar etiquetas y errores de los formularios.

## LÃ³gica y Variables de Estado
- `isLogin` (boolean): Alterna la vista del formulario entre Acceso y Registro.
- `name` / `password`: Campos controlados del formulario.
- `loading`: Controla la sobrecarga visual (spinners) y desactiva el botÃ³n de envÃ­o durante peticiones.
- `error` / `successMessage`: Almacenan avisos para informar al usuario sobre credenciales incorrectas o registros exitosos.

## Flujo de CÃ³digo Importante
La funciÃ³n principal es `handleSubmit(e)`. Cuando el usuario intenta interactuar con el formulario:
1. **ValidaciÃ³n:** Se bloquean envÃ­os de contraseÃ±as cortas (< 6 caracteres) en el registro.
2. **EjecuciÃ³n:** 
   - Si `isLogin === true`: Llama a `login(name, password)` del Store. Si falla, setea error.
   - Si `isLogin === false`: Llama a `register(name, password)`. Si tiene Ã©xito, muestra banner de Ã©xito y pasa el estado a vista de inicio de sesiÃ³n (`setIsLogin(true)`).
3. **BotÃ³n de Test (Opcional):** Cuenta con un botÃ³n que llama a `testLogin()`. Esta funciÃ³n puentea la cuenta temporalmente para ahorrar tiempo a desarrolladores o testers.

## Estructura Visual
- Efecto de cristal esmerilado (`backdrop-blur`).
- Campos de texto estilizados con iconos integrados a la izquierda.
- Elemento animado de tabulaciÃ³n (`translate-x-[100%]`) que resalta visualmente si estamos en la pestaÃ±a Log-in o Register.
# Clase: MiPerfil (`MiPerfil.tsx`)

## PropÃ³sito General
La vista dedicada al usuario y sus configuraciones. Permite cambiar elementos cosmÃ©ticos (avatar), elegir opciones de la aplicaciÃ³n (idioma y modo oscuro) y observar el progreso del jugador traducido a logros, aves coleccionadas e historial.

## Secciones y PestaÃ±as (`activeTab`)
El sub-menÃº se divide en 4 vistas controladas de manera local:
1. **Settings / ConfiguraciÃ³n (`settings`):** 
   - Llama a `toggleTheme` para oscurecer la paleta Tailwind.
   - Modifica el string `language` en Zustand, lo que provoca que toda la app re-renderice instantÃ¡neamente con la nueva etiqueta en `translations[language]`.
2. **Companion / AcompaÃ±ante (`companion`):**
   - Elige entre las especies coleccionadas cuÃ¡l aparecerÃ¡ de mascota. Almacena en `setFavoriteBird`.
3. **Logros / Progreso (`achievements`):**
   - Intersecciona las variables de estado global `playerBirds` y `categories`. Produce barras de progreso que se colorean si el usuario ha atrapado al menos un ejemplar de dicha categorÃ­a o especie.
   - Las medallas (Bagdes) no se guardan directamente; se procesan al vuelo. Si el `uniqueSpeciesCount > 0`, automÃ¡ticamente aprueba el badge "Primer Avistamiento".
4. **Historial (`history`):**
   - Observa `activityHistory`, donde se ha estado guardando cualquier cambio en el inventario o la expediciÃ³n, y formatea las marcas de tiempo (`timestamp`) de MS a minutos, horas o dÃ­as.

## Interfaz Modal Inteligente
Existen varios modales como `isAvatarModalOpen`. En este:
- El usuario usa opciones predeterminadas visualizando URLs de la api *Dicebar*.
- Si decide usar una propia, el botÃ³n `uploadPhoto` abre un campo input de tipo "file". React convierte la imagen seleccionada temporalmente usando `URL.createObjectURL(file)` y luego lo empuja como nuevo avatar a Zustand usando `setAvatar`.
# Clase: ElSantuario (`ElSantuario.tsx`)

## PropÃ³sito General
La "Home" de la aplicaciÃ³n. Representa un Ã¡rbol virtual (El Santuario) donde reposan visualmente las aves coleccionadas y el estado vital de la partida. Sirve para resumir la economÃ­a, clima y accesos rÃ¡pidos de progresiÃ³n.

## Elementos y Variables
Destaca el uso de `playerBirds` proveniente del `useAppStore`. Este arreglo se itera y se dispersa (con variabilidades o CSS Position controlados) alrededor de la jerarquÃ­a visual para figurar que los pÃ¡jaros estÃ¡n descansando.

## Interactividad de Aves
Al tocar un ejemplar de la bandada se levanta el modal detallado del pÃ¡jaro.
- **Detalles BiolÃ³gicos:** Muestra su Canto, Plumaje, Vuelo, y curiosidades traducidas o el audio original si `fetchBirdAudio` retorna algo.
- **Funcionalidades de Mantenimiento:**
  - `handleLevelUp`: Por un costo numÃ©rico progresivo de plumas, aumenta de nivel subiendo atributos escalados.
  - Subsanamiento de `Stamina` natural.

## Detalles AtmosfÃ©ricos ("Live Environment")
El componente analiza el `time.phase` (que se computa entre Morning/Afternoon/Night):
- AÃ±ade efectos CSS de gradientes superpuestos (`bg-gradient-to-b`).
- Dibuja PartÃ­culas de manera interactiva (efectos de luciÃ©rnagas o polen segÃºn sea de dÃ­a o noche) o rayos de luz god-rays (`light-ray` animations).

## El Componente "Tip" (Consejo Naturalista)
Un `useEffect` con temporizador o acciÃ³n manual que rota entre un catÃ¡logo de consejos y curiosidades botÃ¡nicas y ornitorrincas para darle valor educativo y folclÃ³rico a la aplicaciÃ³n. Muestra una progresiÃ³n (`streak`) de dÃ­as conectados consecutivamente.
# Clase: ElSocial (`ElSocial.tsx`)

## PropÃ³sito General
Fomentar la retenciÃ³n y comunidad de usuarios. Separa su lÃ³gica en 2 ramas (Controladas por el estado local `activeTab` -> `'wall' | 'guild'`):
1. **Muro Comunitario (Wall):** Un feed de microblogging para avistamientos.
2. **Mi Bandada (Guilds):** El ecosistema de un grupo/clan cooperativo en juegos mÃ³viles multijugador.

## Flujos Destacados
### 1. Sistema de Avistamientos y Fotos Nativas
La funciÃ³n `handleAttachPhoto` invoca el plugin oficial de Capacitor (`@capacitor/camera`). Pide acceso nativo iterativamente a los permisos de hardware (CÃ¡mara / GalerÃ­a). Si es aceptado, retiene la URL base64 de la foto cargada `setAttachedImage(image.dataUrl)` para publicarla y distribuirla al muro de la API mediante `handlePublish`.

### 2. ContribuciÃ³n de Bandada (Guilds)
Un usuario pertenece a un clan `currentUser?.guildId`.
- **MisiÃ³n Global:** DesafÃ­o temporal ("Captura 50 mirlos"). Existe una barra de progreso que se rellena interconectivamente con los miembros del grupo por iteraciÃ³n del arreglo de miembros.
- **Chat Flotante:** Un `Chat Modal` renderiza burbujas de texto asÃ­ncronos para comunicar jugadores en red local, con el objetivo eventual de persistirlos globalmente. 
- Permite funciones administrativas si eres lÃ­der o abandonar la guild si ya hay una instancia seleccionada.

## DiseÃ±o y ExpansiÃ³n
- Un sistema de hilo de comentarios desplegable. La acciÃ³n de responder actualiza los comentarios hijos de `posts`.
- InclusiÃ³n de reacciones (Emoji de pÃ¡jaro, cÃ¡mara, pluma) al estilo Facebook / Slack (`reactToPost`).
# Clase: ElTienda (`ElTienda.tsx`)

## PropÃ³sito General
Maneja la monetizaciÃ³n (moneda del juego) y acceso a elementos RNG (Sobres gacha y consumibles). Dividida en dos subpestaÃ±as: Comprar y Vender mochila.

## LÃ³gica DinÃ¡mica y Temporadas
La tienda en la vida real cambia, y el componente `ElTienda.tsx` simula esto al montarse (`useEffect`). Si la lluvia estÃ¡ presente (`weather?.condition`), ofrecerÃ¡ en el estante una oferta dinÃ¡mica (Ej: *Mezcla de EnergÃ­a*), con un texto de promociÃ³n estacional. Si hace calor, expone *PrismÃ¡ticos HD*. Se inyectan en tiempo real dentro del arreglo `storeItems`.

## Flujo de Gacha: Paquetes Cartas (`handlePackOpening`)
Es la funciÃ³n mÃ¡s visual y sofisticada de la clase. Representa la mecÃ¡nica de las "cajas de luz/cartas":
1. Detiene la interfaz, superpone un modal sin salida (`isOpeningPack = true`).
2. Deduce la divisa y hace 3 interacciones con el catÃ¡logo general `BIRD_CATALOG`. `Math.floor(Math.random() * length)`.
3. Para prevenir saturaciÃ³n en UI si toca el mismo pÃ¡jaro dos veces, los agrupa comprobando ocurrencias y aÃ±ade un booleano `isMultiple`. Guarda los nombres en la DB local usando `addBirdToSantuario`.
4. El programa hace un `setTimeout` de 3 segundos simulando un render superpuesto para crear asombombro. Por CSS en `map()`, el Ã­ndice de iteraciÃ³n `idx` se asocia a la propiedad css `animationDelay`, lo que causa que los 3 pÃ¡jaros resultantes salten secuencialmente al girar la carta en pantalla en vez de todos de golpe.

## EconomÃ­a Secundaria
La mochila no solo guarda objetos. La pestaÃ±a 'Vender' lee la propiedad `inventory`. Por cada click sobre el botÃ³n respectivo del objeto, invoca `handleSell`, que destruye el objeto `sellItem(item.id)` a favor de un rembolso fijo de plumas doradas, reiniciando un pequeÃ±o ciclo econÃ³mico para comprar mÃ¡s Gacha.
