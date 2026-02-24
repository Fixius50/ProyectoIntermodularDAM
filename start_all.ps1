# AVIS Unified Startup Script (Clean & Build)
# Author: Roberto Monedero Alonso (Arquitecto)

$ScriptDir = $PSScriptRoot
if (-not $ScriptDir) { $ScriptDir = Get-Location }

$BACKEND_DIR = "$ScriptDir"
$FRONTEND_DIR = "$ScriptDir\src\frontend"
$MVNW = "$ScriptDir\src\backend\mvnw.cmd"

Write-Host " Verificando rutas..." -ForegroundColor Gray
Write-Host "   Ruta Base: $ScriptDir"
Write-Host "   Maven Wrapper: $MVNW"

Write-Host " Limpiando Backend..." -ForegroundColor Cyan
if (Test-Path "$MVNW") {
    & "$MVNW" clean
} else {
    Write-Error "No se encontró el Maven Wrapper en: $MVNW"
    exit 1
}

Write-Host " Construyendo Frontend (Build)..." -ForegroundColor Green
Push-Location "$FRONTEND_DIR"
npm run build
Pop-Location

Write-Host " Arrancando Backend (Spring Boot)..." -ForegroundColor Cyan
Start-Process "$MVNW" -ArgumentList "spring-boot:run" -WorkingDirectory "$BACKEND_DIR" -WindowStyle Hidden

Write-Host " Esperando a que el Backend suba (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host " Arrancando Frontend Mode Dev (Vite)..." -ForegroundColor Green
Start-Process "npm" -ArgumentList "run dev" -WorkingDirectory "$FRONTEND_DIR" -WindowStyle Hidden

Write-Host " ¡Todo listo! Backend en :8080, Frontend en :5173" -ForegroundColor Magenta
