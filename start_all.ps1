# AVIS Unified Startup Script
Write-Host "🚀 Iniciando Backend (Spring Boot)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run" -WorkingDirectory "c:\Users\Fixius50\Desktop\ProyectoIntermodularDAM"

Write-Host "⏳ Esperando a que el Backend inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "🌐 Iniciando Frontend (Vite)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WorkingDirectory "c:\Users\Fixius50\Desktop\ProyectoIntermodularDAM\src\frontend"

Write-Host "✅ Sistema arrancado. Backend en :8080, Frontend en :5173" -ForegroundColor Magenta
