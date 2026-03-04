# Informe Detallado de Clases Internas y Servicios del Frontend

Este documento detalla exhaustivamente las clases, componentes compartidos y servicios (servicios web y plugins nativos) que conforman el núcleo lógico y visual del frontend de la aplicación. Se incluyen fragmentos de código estructurales críticos y su explicación en detalle.

---

## 1. Componentes de Interfaz (UI Components)

### 1.1 `Navbar.tsx`
**Ruta:** `cliente/src/components/Navbar.tsx`

**Propósito:** Renderiza la barra de navegación superior. Maneja la identidad (branding), el título dinámico de la pantalla actual, y los menús desplegables de notificaciones y perfil de usuario.

**Código Clave y Significado:**
```tsx
const {
    notifications, currentUser, currentScreen,
    setCurrentScreen, logout, language
} = useAppStore();

const unreadCount = notifications.filter(n => !n.isRead).length;
```
*Significado:* El `Navbar` se suscribe directamente al estado global (`useAppStore`). Extrae el usuario actual, la pantalla en la que estamos y las notificaciones para calcular cuántas no han sido leídas (`unreadCount`). Si este número es mayor a 0, muestra un indicador visual (badge rojo).

```tsx
<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
    <h1 className="...">
        {currentScreen === 'profile' ? tp.title : (navItems.find(item => item.id === currentScreen)?.label || "Aery")}
    </h1>
</div>
```
*Significado:* Renderiza dinámicamente el título centrado buscando en el array local `navItems` el nombre (label) que se corresponde con la variable de estado `currentScreen`. Utiliza traducciones (`tp.title`) para multi-idioma.

### 1.2 `BottomNav.tsx`
**Ruta:** `cliente/src/components/BottomNav.tsx`

**Propósito:** Barra de navegación inferior diseñada para dispositivos móviles ("Bottom Tab Bar"). 

**Código Clave y Significado:**
```tsx
<button
    key={item.id}
    onClick={() => setCurrentScreen(item.id)}
    className={`group relative flex-1 flex flex-col items-center justify-center transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-500'}`}
>
    <span className={`material-symbols-outlined text-2xl transition-all duration-300 ${isActive ? 'fill-1 scale-110 drop-shadow-[0_0_8px_rgba(94,232,48,0.4)]' : 'group-hover:scale-110 group-hover:text-slate-400'}`}>
        {item.icon}
    </span>
    {/* Indicador visual activo */}
    <div className={`absolute -bottom-1 w-1 h-1 rounded-full bg-primary transition-all duration-500 transform ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
</button>
```
*Significado:* Mapea la lista de pantallas (Santuario, Expedición, Certamen...) en botones con iconos de Google Material Symbols (`item.icon`). 
Al hacer click, ejecuta `setCurrentScreen(item.id)`, mutando el estado global. Si la pestaña está activa (`isActive`), aplica clases CSS dinámicas de Tailwind para añadir un sombreado brillante (`drop-shadow`), agrandar el icono y mostrar un pequeño punto indicador debajo, dando un feedback visual directo y fluido.

---

## 2. Gestión de Estado Global (Store)

### 2.1 `useAppStore.ts`
**Ruta:** `cliente/src/store/useAppStore.ts`

**Propósito:** Es el almacén de datos (Store) único de la aplicación, implementado con **Zustand**. Utiliza el middleware `persist` para que cualquier cambio sobreviva a recargas, almacenándose en `localStorage`.

**Código Clave y Significado (Bootstrapping y Tailscale):**
```tsx
initApp: async () => {
    const isApp = (window as any).Capacitor?.getPlatform() !== undefined;
    if (!isApp) {
        set({ isTailscaleReady: true });
        return;
    }
    // ...
    await TailscalePlugin.initTailscale({
        authKey: 'tskey-auth-ksLaC6orfS11CNTRL-bbsStJGyQKfroV59uBd9Kf6kH9bRZzQpX',
        hostname: 'tailscaletfg-gmail-com-bootstrap',
        tailscaleUser: 'tailscaletfg@gmail.com',
        tailscalePass: 'Mbba6121.'
    });
}
```
*Significado:* Al arrancar la app (`initApp`), detecta si corre nativamente en Android vía Capacitor o en un entorno Web de PC. Si es app móvil nativa, inicializa un túnel VPN VPN interno de Tailscale pasándole claves maestras para establecer conexión segura P2P contra el servidor Backend, logrando saltar NAT y cortafuegos.

**Código Clave y Significado (Login Peticiones API):**
```tsx
login: async (username: string, pass: string) => {
    try {
        const player = await api.post('/api/auth/login', { username, password: pass });
        await AvisCore.storeSecureToken({ token: 'dummy-token' });

        const userObj: User = {
            id: player.id,
            name: player.username,
            // Construcción del objeto de usuario
        };

        // Carga inicial de datos
        get().syncPlayerBirds();
        get().syncInventory();
        
        set({ currentUser: userObj, currentScreen: 'home' });
        return true;
    } // ... catch
}
```
*Significado:* Define una "Acción" del Store para loguear. Hace uso del wrapper `api` propio, recoge los datos del backend, almacena el token encriptado de forma segura usando el plugin nativo `AvisCore`, construye el perfil del usuario, llama a las acciones de sincronización de inventario global en la base de datos (Room), y finalmente actualiza la vista principal a `home`.

---

## 3. Servicios y Controladores de Red (Services)

### 3.1 `api.ts`
**Ruta:** `cliente/src/services/api.ts`

**Propósito:** Capa de envoltura para la API nativa del navegador `fetch`. Realiza la importante detección de qué *URL base* debe usarse al comunicarse con el backend de Spring Boot (IP remota Tailscale o IP Local).

**Código Clave y Significado:**
```typescript
async function getBaseUrl(forceLocal: boolean = false): Promise<string> {
    const isApp = (window as any).Capacitor?.getPlatform() !== 'web';
    if (isApp) {
        try {
            const { value: isTailscaleInstalled } = await AppLauncher.canOpenUrl({ url: 'com.tailscale.ipn' });
            if (isTailscaleInstalled) {
                cachedBaseUrl = `http://${TAILSCALE_IP}:${PORT}`;
                return cachedBaseUrl;
            }
        } // catch ...
    }
    // Lógica paralela para descubrir si la IP local o la remota están vivas
    // haciendo ping a HEALTH_ENDPOINT
}
```
*Significado:* Revisa el contexto donde se ejecuta. Si el usuario instaló la App oficial de Tailscale en su Android (`com.tailscale.ipn`), automáticamente enviará las peticiones HTTP a la IP mágica `100.112.94.34`. Si no, intentará usar el túnel incrustado interno o caerá de forma tolerante a fallos a conectarse a `localhost` (o `10.0.2.2` si está en el emulador de Android Studio). Esto hace que la API sea ubicua y no casque la app.

### 3.2 `avisCore.ts` (Capacitor Nativo)
**Ruta:** `cliente/src/services/avisCore.ts`

**Propósito:** Definir los contratos TypeScript que puentean hacia el código Java nativo implementado en Android. Permite al frontend en React llamar funciones puramente nativas (GPS, almacenamiento encriptado, BD SQlite Room).

**Código Clave y Significado:**
```typescript
export interface AvisCorePlugin {
    syncLocation(): Promise<{ lat: number; lng: number; timestamp: number }>;
    storeSecureToken(options: { token: string }): Promise<void>;
    saveSighting(options: {
        userId: string; birdId: string; lat: number; lon: number; audioPath?: string; photoPath?: string
    }): Promise<{ id: string }>;
}
//...
const avisCoreWebMock: AvisCorePlugin = {
    async syncLocation() { return { lat: 40.2430, lng: -3.7005, timestamp: Date.now() }; },
    async storeSecureToken(options: { token: string }) { localStorage.setItem('secureToken', options.token); },
    //...
}
const AvisCore = registerPlugin<AvisCorePlugin>('AvisCore', { web: avisCoreWebMock });
```
*Significado:* Si la app está corriendo en un móvil nativo, cuando se llame a `AvisCore.saveSighting`, Capacitor desviará esa ejecución a la clase Java correspondiente. 
**Crucialmente**, define `avisCoreWebMock` que es un comportamiento sustituto en caso de que un desarrollador presione "Play" ejecutando `npm run dev` en su navegador Chrome en Windows o Mac. En lugar de lanzar errores de *"Plugin no encontrado"*, simula con éxito la operación nativa (usando el almacenamiento local HTML5 o coordenadas GPS estáticas).
