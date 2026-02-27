#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Full project build automation script — AVIS app.
  Builds the React/Vite frontend, syncs Capacitor, and generates the Android APK.

.DESCRIPTION
  Steps performed:
    1. Frontend  → npm run build   (Vite + TypeScript)
    2. Capacitor → npx cap sync android
    3. Android   → gradlew assembleDebug  (debug APK)
               OR gradlew assembleRelease (release APK, requires keystore)

.PARAMETER Mode
  "debug"   (default) — builds an unsigned debug APK, ready to install via adb.
  "release"           — builds a signed release APK (requires signing config in build.gradle).

.PARAMETER SkipFrontend
  Switch to skip the npm build step (useful when only the Android code changed).

.EXAMPLE
  .\build_full.ps1               # Full debug build
  .\build_full.ps1 -Mode release # Full release build
  .\build_full.ps1 -SkipFrontend # Skip npm, only Capacitor + Gradle
#>

param(
    [ValidateSet("debug","release")]
    [string]$Mode = "debug",
    [switch]$SkipFrontend
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Color helpers ---
function Write-Header([string]$msg) { Write-Host "`n===[ $msg ]===" -ForegroundColor Cyan }
function Write-OK([string]$msg)     { Write-Host "  ✔ $msg" -ForegroundColor Green }
function Write-Fail([string]$msg)   { Write-Host "  ✘ $msg" -ForegroundColor Red; exit 1 }

# --- Path constants ---
$ROOT       = $PSScriptRoot
$CLIENTE    = Join-Path $ROOT "Cliente"
$ANDROID    = Join-Path $CLIENTE "android"
$GRADLEW    = Join-Path $ANDROID "gradlew.bat"
$APK_DEBUG  = Join-Path $ANDROID "app\build\outputs\apk\debug\app-debug.apk"
$APK_RELEASE= Join-Path $ANDROID "app\build\outputs\apk\release\app-release.apk"

Write-Header "AVIS Build Script — Mode: $Mode"
Write-Host "  Root    : $ROOT"
Write-Host "  Cliente : $CLIENTE"
Write-Host "  Android : $ANDROID"

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1 — Frontend (Vite + TypeScript)
# ─────────────────────────────────────────────────────────────────────────────
if (-not $SkipFrontend) {
    Write-Header "STEP 1 · Building React/Vite frontend"
    Push-Location $CLIENTE
    try {
        Write-Host "  Running: npm run build"
        npm run build
        if ($LASTEXITCODE -ne 0) { Write-Fail "npm run build failed (exit $LASTEXITCODE)" }
        Write-OK "Frontend built → $CLIENTE\dist"
    } finally {
        Pop-Location
    }
} else {
    Write-Host "  [SkipFrontend] Skipping npm build." -ForegroundColor Yellow
}

# ─────────────────────────────────────────────────────────────────────────────
# STEP 2 — Capacitor sync
# ─────────────────────────────────────────────────────────────────────────────
Write-Header "STEP 2 · Syncing Capacitor → Android"
Push-Location $CLIENTE
try {
    Write-Host "  Running: npx cap sync android"
    npx cap sync android
    if ($LASTEXITCODE -ne 0) { Write-Fail "cap sync android failed (exit $LASTEXITCODE)" }
    Write-OK "Capacitor sync complete"
} finally {
    Pop-Location
}

# ─────────────────────────────────────────────────────────────────────────────
# STEP 3 — Gradle build (APK)
# ─────────────────────────────────────────────────────────────────────────────
Write-Header "STEP 3 · Building Android APK ($Mode)"

if (-not (Test-Path $GRADLEW)) {
    Write-Fail "gradlew.bat not found at: $GRADLEW. Did you run `npx cap add android`?"
}

Push-Location $ANDROID
try {
    $gradleTask = if ($Mode -eq "release") { "assembleRelease" } else { "assembleDebug" }
    Write-Host "  Running: gradlew.bat $gradleTask"
    & $GRADLEW $gradleTask --stacktrace
    if ($LASTEXITCODE -ne 0) { Write-Fail "Gradle $gradleTask failed (exit $LASTEXITCODE)" }
} finally {
    Pop-Location
}

# ─────────────────────────────────────────────────────────────────────────────
# STEP 4 — Report result
# ─────────────────────────────────────────────────────────────────────────────
Write-Header "STEP 4 · Build result"
$apkPath = if ($Mode -eq "release") { $APK_RELEASE } else { $APK_DEBUG }

if (Test-Path $apkPath) {
    $sizeKB = [math]::Round((Get-Item $apkPath).Length / 1KB, 1)
    Write-OK "APK generated: $apkPath ($sizeKB KB)"
    Write-Host ""
    Write-Host "  To install via USB debug:" -ForegroundColor Yellow
    Write-Host "    adb install -r `"$apkPath`"" -ForegroundColor White
} else {
    Write-Fail "APK not found at expected path: $apkPath"
}

Write-Host "`n  Build completed successfully!" -ForegroundColor Green
