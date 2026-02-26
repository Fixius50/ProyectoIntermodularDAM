$ErrorActionPreference = "Stop"

$SdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$NdkPath = "$SdkPath\ndk\25.0.8775105"

$env:ANDROID_HOME = $SdkPath
$env:ANDROID_SDK_ROOT = $SdkPath
$env:ANDROID_NDK_HOME = $NdkPath

Write-Host "ANDROID_HOME     = $env:ANDROID_HOME"
Write-Host "ANDROID_NDK_HOME = $env:ANDROID_NDK_HOME"

$gomobile = "$env:USERPROFILE\go\bin\gomobile.exe"

Write-Host "Ejecutando gomobile init..."
& $gomobile init

Write-Host "Compilando tailscalebridge.aar (API 21)..."
& $gomobile bind -v -target=android/arm64 -androidapi 21 -o tailscalebridge.aar .

if (Test-Path "tailscalebridge.aar") {
    $dest = "..\Cliente\android\app\libs"
    if (-not (Test-Path $dest)) {
        New-Item -ItemType Directory -Path $dest | Out-Null
    }
    Copy-Item -Force "tailscalebridge.aar" $dest
    Write-Host "Completado. Copiado a: $dest"
} else {
    Write-Host "ERROR: No se genero tailscalebridge.aar"
    exit 1
}
