#!/usr/bin/env pwsh
<#
.SYNOPSIS
  AVIS Unified Dev Startup Script (STRICT RELATIVE PATHS).
  Builds the frontend, starts Spring Boot backend + Vite dev server.

.DESCRIPTION
  - Backend (Spring Boot) corre en http://localhost:8080 (Conexión remota a Redis/RabbitMQ via Tailscale)
  - Frontend (Vite dev server) corre en http://localhost:5173
  Pulsa 'Q' para apagar ambos procesos.

.NOTES
  Author: Roberto Monedero Alonso
#>

# Forzar ejecución en el directorio del script
Set-Location $PSScriptRoot

# Definición de rutas DINÁMICAS (portables, no hardcodeadas)
$ROOT_DIR = $PSScriptRoot
$FRONTEND_DIR = Join-Path $ROOT_DIR "cliente"
$MVNW = Join-Path $ROOT_DIR "mvnw.cmd"

Write-Host ""
Write-Host "  AVIS Dev Startup (Portable Mode)" -ForegroundColor Magenta
Write-Host "  ====================================" -ForegroundColor DarkGray
Write-Host "  Directorio Raíz : $ROOT_DIR" -ForegroundColor Gray
Write-Host "  Frontend        : $FRONTEND_DIR" -ForegroundColor Gray
Write-Host ""

# Validaciones
if (-not (Test-Path $MVNW))         { Write-Error "mvnw.cmd no encontrado en: $MVNW"; exit 1 }
if (-not (Test-Path $FRONTEND_DIR)) { Write-Error "Carpeta cliente/ no encontrada en: $FRONTEND_DIR"; exit 1 }

# ── Limpiar procesos antiguos ───────────────────────────────────────────────
Write-Host "  [1/4] Limpiando procesos Node/Vite antiguos..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# ── Build Frontend ───────────────────────────────────────────────────────────
Write-Host "  [2/4] Instalando dependencias frontend (npm install)..." -ForegroundColor Green
Push-Location $FRONTEND_DIR
try {
    npm.cmd install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) { Write-Error "npm install fallo en $FRONTEND_DIR"; exit 1 }
} finally { Pop-Location }

# ── Arrancar Backend ─────────────────────────────────────────────────────────
Write-Host "  [3/4] Arrancando Backend Spring Boot..." -ForegroundColor Cyan
$BackendJob = Start-Job -Name "Backend-Avis" -ScriptBlock {
    param($dir, $mvnw)
    Set-Location $dir
    & "$mvnw" spring-boot:run
} -ArgumentList $ROOT_DIR, $MVNW

Write-Host "  Esperando que el Backend arranque (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# ── Arrancar Frontend Dev Server ─────────────────────────────────────────────
Write-Host "  [4/4] Arrancando Frontend (Vite dev server)..." -ForegroundColor Green
$FrontendJob = Start-Job -Name "Frontend-Avis" -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm.cmd run dev
} -ArgumentList $FRONTEND_DIR

Write-Host ""
Write-Host "  =======================================" -ForegroundColor DarkGray
Write-Host "  Backend  -> http://localhost:8080"       -ForegroundColor Cyan
Write-Host "  Frontend -> http://localhost:5173"       -ForegroundColor Green
Write-Host "  INFRA    -> 100.112.94.34 (Tailscale)"   -ForegroundColor Magenta
Write-Host "  =======================================" -ForegroundColor DarkGray
Write-Host "  Mostrando LOGS. Pulsa [Q] para DETENER." -ForegroundColor Red
Write-Host ""

# ── Bucle de Logs ────────────────────────────────────────────────────────────
$running = $true
while ($running) {
    if ([console]::KeyAvailable) {
        $key = [console]::ReadKey($true)
        if ($key.Key -eq 'Q') { $running = $false }
    }
    
    $backendOut = Receive-Job -Job $BackendJob -Keep
    if ($backendOut) { $backendOut | ForEach-Object { Write-Host "[BACKEND] $_" -ForegroundColor Gray } }
    
    $frontendOut = Receive-Job -Job $FrontendJob -Keep
    if ($frontendOut) { $frontendOut | ForEach-Object { Write-Host "[FRONTEND] $_" -ForegroundColor DarkGray } }
    
    Start-Sleep -Milliseconds 500
}

# ── Apagar servicios ─────────────────────────────────────────────────────────
Write-Host "`n  Apagando servicios..." -ForegroundColor Yellow
Stop-Job -Name "Frontend-Avis" -ErrorAction SilentlyContinue
Remove-Job -Name "Frontend-Avis" -ErrorAction SilentlyContinue
Stop-Job -Name "Backend-Avis" -ErrorAction SilentlyContinue
Remove-Job -Name "Backend-Avis" -ErrorAction SilentlyContinue
Write-Host "  Servicios apagados." -ForegroundColor Green
