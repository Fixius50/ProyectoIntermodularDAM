const { chromium } = require('playwright');

(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        // Registrar mensajes de la consola
        page.on('console', msg => {
            console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}:`, msg.text());
        });

        // Registrar errores no capturados en la página
        page.on('pageerror', error => {
            console.error('[BROWSER ERROR]:', error.message);
        });

        // Interceptar peticiones fallidas (opcional, por si falla cargar algún recurso)
        page.on('requestfailed', request => {
            console.error(`[REQUEST FAILED] ${request.url()} - ${request.failure().errorText}`);
        });

        console.log("Navegando a http://localhost:5173 ...");
        // Navegar a la app local de Vite
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

        // Esperamos un momento extra por si React necesita tiempo para renderizar el error
        await page.waitForTimeout(3000);

        await browser.close();
        console.log("Análisis finalizado.");
    } catch (err) {
        console.error("[SCRIPT ERROR]:", err);
        process.exit(1);
    }
})();
