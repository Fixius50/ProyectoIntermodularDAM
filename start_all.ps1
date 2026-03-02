#!/usr/bin/env pwsh
<#
.SYNOPSIS
  AVIS Unified Dev Startup Script.
  Builds the frontend, starts Spring Boot backend + Vite dev server.

.DESCRIPTION
  - Backend (Spring Boot) corre en http://localhost:8080
  - Frontend (Vite dev server) corre en http://localhost:5173
  Pulsa ENTER para apagar ambos procesos.

.NOTES
  Author: Roberto Monedero Alonso
#>

$ScriptDir = $PSScriptRoot
if (-not $ScriptDir) { $ScriptDir = Get-Location }
Set-Location $ScriptDir

# Rutas ABSOLUTAS para la lógica interna
$BACKEND_ABS  = $ScriptDir
$FRONTEND_ABS = Join-Path $ScriptDir "cliente"
$MVNW_ABS     = Join-Path $ScriptDir "mvnw.cmd"

# Rutas RELATIVAS solo para visualización
$BACKEND_REL  = "."
$FRONTEND_REL = ".\cliente"
$MVNW_REL     = ".\mvnw.cmd"

Write-Host ""
Write-Host "  AVIS Dev Startup" -ForegroundColor Magenta
Write-Host "  ====================================" -ForegroundColor DarkGray
Write-Host "  Backend  : [Proyecto Raíz]" -ForegroundColor Gray
Write-Host "  Frontend : $FRONTEND_REL" -ForegroundColor Gray
Write-Host "  Maven    : $MVNW_REL" -ForegroundColor Gray
Write-Host ""

# Validaciones rapidas
if (-not (Test-Path $MVNW_ABS))         { Write-Error "mvnw.cmd no encontrado en: $MVNW_ABS"; exit 1 }
if (-not (Test-Path $FRONTEND_ABS)) { Write-Error "Carpeta cliente/ no encontrada en: $FRONTEND_ABS"; exit 1 }

# ── Limpiar Backend ──────────────────────────────────────────────────────────
Write-Host "  [1/4] Limpiando Backend (mvn clean)..." -ForegroundColor Cyan
& "$MVNW_ABS" clean
if ($LASTEXITCODE -ne 0) { Write-Error "mvn clean fallo"; exit 1 }

# ── Limpiar Procesos Node Antiguos ───────────────────────────────────────────
Write-Host "  [1.5/4] Limpiando procesos Node/Vite antiguos..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# ── Build Frontend ───────────────────────────────────────────────────────────
Write-Host "  [2/4] Instalando dependencias frontend (npm install)..." -ForegroundColor Green
Push-Location $FRONTEND_ABS
try {
    npm.cmd install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) { Write-Error "npm install fallo"; exit 1 }
} finally { Pop-Location }

# ── Arrancar Backend ─────────────────────────────────────────────────────────
Write-Host "  [3/4] Arrancando Backend Spring Boot..." -ForegroundColor Cyan
$BackendJob = Start-Job -Name "Backend-Avis" -ScriptBlock {
    param($dir, $mvnw)
    Set-Location $dir
    & "$mvnw" spring-boot:run
} -ArgumentList $BACKEND_ABS, $MVNW_ABS

Write-Host "  Esperando que el Backend arranque (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# ── Arrancar Frontend Dev Server ─────────────────────────────────────────────
Write-Host "  [4/4] Arrancando Frontend (Vite dev server)..." -ForegroundColor Green
$FrontendJob = Start-Job -Name "Frontend-Avis" -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm.cmd run dev
} -ArgumentList $FRONTEND_ABS

Write-Host ""
Write-Host "  =======================================" -ForegroundColor DarkGray
Write-Host "  Backend  -> http://localhost:8080"       -ForegroundColor Cyan
Write-Host "  Frontend -> http://localhost:5173"       -ForegroundColor Green
Write-Host "  Swagger  -> http://localhost:8080/swagger-ui.html" -ForegroundColor DarkCyan
Write-Host "  =======================================" -ForegroundColor DarkGray
Write-Host "  Mostrando LOGS en tiempo real. Pulsa [Q] para DETENER los servidores." -ForegroundColor Red
Write-Host ""

# ── Bucle de Logs ────────────────────────────────────────────────────────────
$running = $true
while ($running) {
    if ([console]::KeyAvailable) {
        $key = [console]::ReadKey($true)
        if ($key.Key -eq 'Q') { $running = $false }
    }
    
    # Recibir logs del Backend
    $backendOut = Receive-Job -Job $BackendJob -Keep
    if ($backendOut) {
        $backendOut | ForEach-Object { Write-Host "[BACKEND] $_" -ForegroundColor Gray }
    }
    
    # Recibir logs del Frontend
    $frontendOut = Receive-Job -Job $FrontendJob -Keep
    if ($frontendOut) {
        $frontendOut | ForEach-Object { Write-Host "[FRONTEND] $_" -ForegroundColor DarkGray }
    }
    
    Start-Sleep -Milliseconds 500
}

# ── Apagar servicios ─────────────────────────────────────────────────────────
Write-Host ""
Write-Host "  Apagando servicios..." -ForegroundColor Yellow

# Detener los Jobs y sus procesos hijos
Stop-Job -Name "Frontend-Avis" -ErrorAction SilentlyContinue
Remove-Job -Name "Frontend-Avis" -ErrorAction SilentlyContinue

Stop-Job -Name "Backend-Avis" -ErrorAction SilentlyContinue
Remove-Job -Name "Backend-Avis" -ErrorAction SilentlyContinue

Write-Host "  Servicios apagados." -ForegroundColor Green
