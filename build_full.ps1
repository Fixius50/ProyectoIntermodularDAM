#!/usr/bin/env pwsh
<#
.SYNOPSIS
  AVIS APK Build Script.
  Builds the React/Vite frontend, syncs Capacitor, and generates the Android APK.

.PARAMETER Mode
  "debug"   (default) - unsigned debug APK.
  "release"           - signed release APK.

.PARAMETER SkipFrontend
  Skip npm build (use when only Android code changed).

.EXAMPLE
  .\build_full.ps1               # Full debug build
  .\build_full.ps1 -Mode release # Release APK
  .\build_full.ps1 -SkipFrontend # Only Capacitor + Gradle
#>

param(
    [ValidateSet("debug","release")]
    [string]$Mode = "debug",
    [switch]$SkipFrontend
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Header([string]$msg) { Write-Host ""; Write-Host "===[ $msg ]===" -ForegroundColor Cyan }
function Write-OK([string]$msg)     { Write-Host "  OK: $msg" -ForegroundColor Green }
function Write-Fail([string]$msg)   { Write-Host "  FAIL: $msg" -ForegroundColor Red; exit 1 }

$ROOT     = $PSScriptRoot
$CLIENTE  = Join-Path $ROOT "Cliente"
$ANDROID  = Join-Path $CLIENTE "android"
$GRADLEW  = Join-Path $ANDROID "gradlew.bat"
$APK_PATH = if ($Mode -eq "release") {
    Join-Path $ANDROID "app\build\outputs\apk\release\app-release.apk"
} else {
    Join-Path $ANDROID "app\build\outputs\apk\debug\app-debug.apk"
}

$AAB_PATH = if ($Mode -eq "release") {
    Join-Path $ANDROID "app\build\outputs\bundle\release\app-release.aab"
} else {
    Join-Path $ANDROID "app\build\outputs\bundle\debug\app-debug.aab"
}

Write-Header "AVIS Build Script - Mode: $Mode"
Write-Host "  Frontend : $CLIENTE"
Write-Host "  Android  : $ANDROID"

# ── STEP 0: Build Tailscale Bridge (Go) ──────────────────────────────────────
Write-Header "STEP 0 - Building Tailscale Bridge (Go)"
Push-Location $ROOT
try {
    cd tailscalebridge
    powershell .\build_aar.ps1
    if ($LASTEXITCODE -ne 0) { Write-Fail "build_aar.ps1 failed (exit $LASTEXITCODE)" }
    Write-OK "Tailscale Bridge (.aar) built"
} finally { 
    cd $ROOT
    Pop-Location 
}

# ── STEP 1: npm run build ────────────────────────────────────────────────────
if (-not $SkipFrontend) {
    Write-Header "STEP 1 - Building React/Vite frontend"
    Push-Location $CLIENTE
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) { Write-Fail "npm run build failed (exit $LASTEXITCODE)" }
        Write-OK "Frontend built -> dist/"
    } finally { Pop-Location }
} else {
    Write-Host "  [SkipFrontend] Skipping npm build." -ForegroundColor Yellow
}

# ── STEP 2: Capacitor sync ───────────────────────────────────────────────────
Write-Header "STEP 2 - Capacitor sync -> Android"
Push-Location $CLIENTE
try {
    npx cap sync android
    if ($LASTEXITCODE -ne 0) { Write-Fail "cap sync failed (exit $LASTEXITCODE)" }
    Write-OK "Capacitor synced"
} finally { Pop-Location }

# ── STEP 3: Gradle APK & AAB ─────────────────────────────────────────────────
Write-Header "STEP 3 - Gradle build ($Mode)"
if (-not (Test-Path $GRADLEW)) { Write-Fail "gradlew.bat not found: $GRADLEW" }
Push-Location $ANDROID
try {
    # Construimos tanto el APK como el AAB para máxima flexibilidad
    $task_apk = if ($Mode -eq "release") { "assembleRelease" } else { "assembleDebug" }
    $task_aab = if ($Mode -eq "release") { "bundleRelease" } else { "bundleDebug" }
    
    Write-Host "  Building APK..." -ForegroundColor Gray
    & $GRADLEW $task_apk
    if ($LASTEXITCODE -ne 0) { Write-Fail "Gradle $task_apk failed (exit $LASTEXITCODE)" }
    Write-Host "  Building AAB..." -ForegroundColor Gray
    & $GRADLEW $task_aab
    if ($LASTEXITCODE -ne 0) { Write-Fail "Gradle $task_aab failed (exit $LASTEXITCODE)" }
} finally { Pop-Location }

if (-not (Test-Path $APK_PATH)) { Write-Fail "APK not found at: $APK_PATH" }
if (-not (Test-Path $AAB_PATH)) { Write-Fail "AAB not found at: $AAB_PATH" }

$sizeMB_apk = [math]::Round((Get-Item $APK_PATH).Length / 1MB, 1)
$sizeMB_aab = [math]::Round((Get-Item $AAB_PATH).Length / 1MB, 1)

Write-Header "Done"
Write-OK "APK ready: $APK_PATH ($sizeMB_apk MB)"
Write-OK "AAB ready: $AAB_PATH ($sizeMB_aab MB)"
Write-Host ""
Write-Host "  Install via Android Studio: Run button (device connected)" -ForegroundColor Yellow
Write-Host "  Build completed!" -ForegroundColor Green
