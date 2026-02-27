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

$BACKEND_DIR  = $ScriptDir                             # raiz del proyecto (mvnw.cmd esta aqui)
$FRONTEND_DIR = Join-Path $ScriptDir "Cliente"         # carpeta del frontend React/Vite
$MVNW         = Join-Path $ScriptDir "mvnw.cmd"

Write-Host ""
Write-Host "  AVIS Dev Startup" -ForegroundColor Magenta
Write-Host "  ====================================" -ForegroundColor DarkGray
Write-Host "  Backend  : $BACKEND_DIR" -ForegroundColor Gray
Write-Host "  Frontend : $FRONTEND_DIR" -ForegroundColor Gray
Write-Host "  Maven    : $MVNW" -ForegroundColor Gray
Write-Host ""

# Validaciones rapidas
if (-not (Test-Path $MVNW))         { Write-Error "mvnw.cmd no encontrado en: $MVNW"; exit 1 }
if (-not (Test-Path $FRONTEND_DIR)) { Write-Error "Carpeta Cliente/ no encontrada en: $FRONTEND_DIR"; exit 1 }

# ── Limpiar Backend ──────────────────────────────────────────────────────────
Write-Host "  [1/4] Limpiando Backend (mvn clean)..." -ForegroundColor Cyan
& "$MVNW" clean
if ($LASTEXITCODE -ne 0) { Write-Error "mvn clean fallo"; exit 1 }

# ── Build Frontend ───────────────────────────────────────────────────────────
Write-Host "  [2/4] Instalando dependencias frontend (npm install)..." -ForegroundColor Green
Push-Location $FRONTEND_DIR
try {
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) { Write-Error "npm install fallo"; exit 1 }
} finally { Pop-Location }

# ── Arrancar Backend ─────────────────────────────────────────────────────────
Write-Host "  [3/4] Arrancando Backend Spring Boot..." -ForegroundColor Cyan
$BackendProcess = Start-Process `
    -FilePath    "$MVNW" `
    -ArgumentList "spring-boot:run" `
    -WorkingDirectory $BACKEND_DIR `
    -WindowStyle Normal `
    -PassThru

Write-Host "  Esperando que el Backend arranque (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# ── Arrancar Frontend Dev Server ─────────────────────────────────────────────
Write-Host "  [4/4] Arrancando Frontend (Vite dev server)..." -ForegroundColor Green
$FrontendProcess = Start-Process `
    -FilePath    "npm.cmd" `
    -ArgumentList "run", "dev" `
    -WorkingDirectory $FRONTEND_DIR `
    -WindowStyle Normal `
    -PassThru

Write-Host ""
Write-Host "  =======================================" -ForegroundColor DarkGray
Write-Host "  Backend  -> http://localhost:8080"       -ForegroundColor Cyan
Write-Host "  Frontend -> http://localhost:5173"       -ForegroundColor Green
Write-Host "  Swagger  -> http://localhost:8080/swagger-ui.html" -ForegroundColor DarkCyan
Write-Host "  =======================================" -ForegroundColor DarkGray
Write-Host "  Pulsa ENTER para APAGAR los servidores." -ForegroundColor Red
Write-Host ""
Pause

# ── Apagar servicios ─────────────────────────────────────────────────────────
Write-Host "  Apagando servicios..." -ForegroundColor Yellow
if ($FrontendProcess -and -not $FrontendProcess.HasExited) {
    taskkill /PID $FrontendProcess.Id /T /F 2>$null
}
if ($BackendProcess -and -not $BackendProcess.HasExited) {
    taskkill /PID $BackendProcess.Id /T /F 2>$null
}
Write-Host "  Servicios apagados." -ForegroundColor Green
