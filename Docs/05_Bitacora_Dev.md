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

### Error: Pantalla en blanco ("Element type is invalid: expected a string but got: object")

**Fecha:** 2026-02-24
**Contexto:** Montaje del punto de entrada en web (`index.web.js`) en React Native Web usando Vite.
**Síntoma:** Compila correctamente (exit 0), pero al abrir en localhost muestra una pantalla en blanco. En la consola del navegador salta el error: `Uncaught Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.`
**Causa:** Conflicto de resolución de módulos de Vite al faltar la extensión explícita. El archivo `index.web.js` contenía `import App from './App'`. Al existir tanto `App.tsx` (el componente) como `app.json` (configuración) en el mismo nivel, Vite resolvía e importaba `app.json` en lugar de `App.tsx`. Esto pasó a React un objeto JSON puro (con configuración) en lugar de un React Node válido, provocando el fallo de render.
**Solución:** Modificar la importación en `index.web.js` para exigir explícitamente la extensión: `import App from './App.tsx'`.
