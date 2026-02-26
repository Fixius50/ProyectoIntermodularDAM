$ErrorActionPreference = "Stop"

$SdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$NdkPath = "$SdkPath\ndk\25.0.8775105"
$env:ANDROID_HOME     = $SdkPath
$env:ANDROID_SDK_ROOT = $SdkPath
$env:ANDROID_NDK_HOME = $NdkPath

Write-Host "NDK: $NdkPath"

$gomobile = "$env:USERPROFILE\go\bin\gomobile.exe"

Write-Host "gomobile init..."
& $gomobile init

Write-Host "Compilando tailscalebridge.aar (API 21)..."
& $gomobile bind -v -target=android -androidapi 21 -o tailscalebridge.aar .

if (Test-Path "tailscalebridge.aar") {
    $dest = "..\Cliente\android\app\libs"
    if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }
    Copy-Item -Force "tailscalebridge.aar" $dest
    Write-Host "EXITO. Copiado a: $dest"
} else {
    Write-Host "FALLO: tailscalebridge.aar no generado."
    exit 1
}
