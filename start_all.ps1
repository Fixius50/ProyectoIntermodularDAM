# AVIS Unified Startup Script (Clean & Build)
# Author: Roberto Monedero Alonso (Arquitecto)

$ScriptDir = $PSScriptRoot
if (-not $ScriptDir) { $ScriptDir = Get-Location }

$BACKEND_DIR = "$ScriptDir"
$FRONTEND_DIR = "$ScriptDir\src\frontend"
$MVNW = "$ScriptDir\mvnw.cmd"

Write-Host " Verificando rutas..." -ForegroundColor Gray
Write-Host "   Ruta Base: $ScriptDir"
Write-Host "   Maven Wrapper: $MVNW"

Write-Host " Limpiando Backend..." -ForegroundColor Cyan
if (Test-Path "$MVNW") {
    & "$MVNW" clean
}
else {
    Write-Error "No se encontró el Maven Wrapper en: $MVNW"
    exit 1
}

Write-Host " Construyendo Frontend (Build)..." -ForegroundColor Green
Push-Location "$FRONTEND_DIR"
npm run build
Pop-Location

Write-Host " Arrancando Backend (Spring Boot)..." -ForegroundColor Cyan
$BackendProcess = Start-Process "$MVNW" -ArgumentList "spring-boot:run" -WorkingDirectory "$BACKEND_DIR" -WindowStyle Hidden -PassThru

Write-Host " Esperando a que el Backend suba (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host " Arrancando Frontend Mode Dev (Vite)..." -ForegroundColor Green
$FrontendProcess = Start-Process "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "$FRONTEND_DIR" -WindowStyle Hidden -PassThru

Write-Host " "
Write-Host " ¡Todo listo!" -ForegroundColor Magenta
Write-Host " Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host " Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host " "
Write-Host " ========================================================" -ForegroundColor DarkGray
Write-Host " Pulsa ENTER en esta ventana para APAGAR los servidores." -ForegroundColor Red
Write-Host " ========================================================" -ForegroundColor DarkGray
Pause

Write-Host " Apagando servicios..." -ForegroundColor Yellow
if ($FrontendProcess -and (-not $FrontendProcess.HasExited)) { 
    taskkill /PID $FrontendProcess.Id /T /F 2>$null
}
if ($BackendProcess -and (-not $BackendProcess.HasExited)) { 
    taskkill /PID $BackendProcess.Id /T /F 2>$null
}
Write-Host " Servicios apagados correctamente." -ForegroundColor Green
