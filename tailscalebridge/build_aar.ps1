$ErrorActionPreference = "Stop"

$SdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$NdkPath = "$SdkPath\ndk\25.2.9519653"
$env:ANDROID_HOME     = $SdkPath
$env:ANDROID_SDK_ROOT = $SdkPath
$env:ANDROID_NDK_HOME = $NdkPath

Write-Host "NDK: $NdkPath"

$gomobile = "$env:USERPROFILE\go\bin\gomobile.exe"

# 1. Limpiar .aar anterior para no usar basura si falla
if (Test-Path "tailscalebridge.aar") {
    Write-Host "Limpiando tailscalebridge.aar antiguo..."
    Remove-Item "tailscalebridge.aar" -Force
}

Write-Host "gomobile init..."
& $gomobile init

Write-Host "Compilando tailscalebridge.aar (API 21)..."
# Usamos -v para ver qué pasa si falla
& $gomobile bind -v -target=android -androidapi 21 -o tailscalebridge.aar .

if ($LASTEXITCODE -ne 0) {
    Write-Host "FALLO CRITICO: gomobile bind falló con código $LASTEXITCODE"
    exit 1
}

if (Test-Path "tailscalebridge.aar") {
    $dest = "..\Cliente\android\app\libs"
    if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }
    Copy-Item -Force "tailscalebridge.aar" $dest
    Write-Host "EXITO. Copiado a: $dest"
} else {
    Write-Host "FALLO: tailscalebridge.aar no se generó a pesar de que gomobile salió con 0."
    exit 1
}
