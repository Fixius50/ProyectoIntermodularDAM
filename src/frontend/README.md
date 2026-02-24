# Frontend Web App (PWA) - El Cuaderno de Campo Vivo

Este directorio contiene el frontend de la aplicación, construido con React 18 y Vite. Está diseñado como una Single Page Application (SPA) responsiva con la vista puesta en convertirse en una PWA (Progressive Web App).

## Requisitos Previos
- Node.js (v18+)
- npm (incluido con Node.js)

## Comandos Útiles

Abre una terminal (PowerShell, CMD, o la terminal de tu editor) y navega a este directorio:
```bash
cd src/frontend
```

### 1. Iniciar el Servidor de Desarrollo
Para probar la app localmente con recarga rápida (Hot Module Replacement) mientras programas:
```bash
npm run dev
```
👉 *Tras ejecutar este comando, la consola te mostrará una ruta local (usualmente `http://localhost:5173/`). Haz "Ctrl + Clic" en ese enlace para abrir la aplicación en tu navegador web.*

### 2. Instalar Dependencias
Si clonas el proyecto en otra máquina o añades librerías nuevas, asegúrate de instalar las dependencias antes de arrancar:
```bash
npm install
```

### 3. Construir para Producción
Cuando la aplicación esté lista para subirse a un servidor o publicarse:
```bash
npm run build
```
Esto creará una carpeta `dist/` con los archivos minificados y optimizados de la web.

### 4. Previsualizar la Construcción de Producción
Para probar localmente cómo se verá la web una vez subida:
```bash
npm run preview
```
