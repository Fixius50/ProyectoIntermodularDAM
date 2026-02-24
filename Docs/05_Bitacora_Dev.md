# 05 Bitácora Dev

## Registro de Errores y Soluciones

### Error: Incompatible React versions (react vs react-dom)

**Fecha:** 2026-02-23
**Contexto:** Al configurar React Native Web con Vite e instalar `react-dom` sin especificar versión.
**Síntoma:** Pantalla blanca en `localhost:5173`. En la consola del navegador aparece:

```text
Uncaught Error: Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:
- react: 19.2.3
- react-dom: 19.2.4
```

**Causa:** El proyecto base de React Native venía con `react@19.2.3`. Al instalar `react-dom` mediante `npm install react-dom`, npm descargó la última versión disponible (`19.2.4`), causando una discrepancia estricta exigida por React.
**Solución:** Forzar la re-instalación explícita de ambas librerías en la misma versión exacta usando:
`npm install react@19.2.3 react-dom@19.2.3 --legacy-peer-deps`
