# Skill: Compilar tailscalebridge.aar para Android

**Cuándo usar:** Cada vez que se modifique `tailscalebridge/tailscalebridge.go` o se necesite regenerar la librería nativa Tailscale para el proyecto Android de AVIS.

---

## Prerrequisitos

| Herramienta | Versión | Instalación |
|---|---|---|
| Go | ≥ 1.21 | https://go.dev/dl/ |
| gomobile | latest | `go install golang.org/x/mobile/cmd/gomobile@latest` |
| Android NDK | 21–35 | Android Studio → SDK Manager → SDK Tools → NDK (Side by side) |

**NDK instalado actualmente:** `25.0.8775105`
**Ruta:** `%LOCALAPPDATA%\Android\Sdk\ndk\25.0.8775105`

---

## Procedimiento (script automático)

```powershell
# Desde la carpeta tailscalebridge/ en una sesión con Go en PATH
cd C:\Users\rober\Desktop\ProyectoIntermodularDAM\tailscalebridge
powershell -ExecutionPolicy Bypass -File .\build_aar.ps1
```

El script `build_aar.ps1`:
1. Configura `ANDROID_HOME`, `ANDROID_NDK_HOME`.
2. Ejecuta `gomobile init`.
3. Ejecuta `gomobile bind -v -target=android -androidapi 21 -o tailscalebridge.aar .`
4. Copia el `.aar` generado a `Cliente/android/app/libs/`.

---

## Errores Conocidos y Soluciones

### `gomobile: command not found`
**Causa:** `%GOPATH%\bin` no está en el PATH.
**Fix:** Abrir la sesión de PowerShell donde Go fue instalado y está en PATH.

### `unsupported API version 16 (not in 21..35)`
**Causa:** gomobile detecta el antiguo `ndk-bundle` (versión 16) en lugar del NDK moderno.
**Fix:** Definir explícitamente antes de ejecutar:
```powershell
$env:ANDROID_NDK_HOME = "$env:LOCALAPPDATA\Android\Sdk\ndk\25.0.8775105"
```

### `unable to import bind: no Go package in golang.org/x/mobile/bind`
**Causa:** `golang.org/x/mobile` no está en el `go.mod` del módulo bridge. gomobile necesita las fuentes del paquete `bind` en el módulo caché.
**Fix (una sola vez):**
```powershell
cd tailscalebridge/
go get golang.org/x/mobile@latest
```
Esto añade la dependencia a `go.mod` y siembra las fuentes. Solo es necesario hacerlo una vez tras clonar el repo.

### Exit code 1 con output de warnings javac/jar — pero el .aar sí se generó
**Causa:** gomobile captura los warnings de `jar` y `javac` en stderr y los reporta como error del proceso.
**Diagnóstico:** Verificar que `tailscalebridge.aar` existe y tiene >50 MB:
```powershell
(Get-Item tailscalebridge.aar).Length
# Resultado esperado: ~62000000 bytes (60 MB)
```

---

## Verificación Post-Build

```powershell
# Comprobar tamaño del .aar (debe ser ~60 MB)
(Get-Item "..\Cliente\android\app\libs\tailscalebridge.aar").Length

# Compilar el APK Android
cd ..\Cliente\android
.\gradlew assembleDebug
```
