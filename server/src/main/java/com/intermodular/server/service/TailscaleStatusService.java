package com.intermodular.server.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.concurrent.TimeUnit;

/**
 * Verifica el estado de Tailscale al iniciar el servidor en Lubuntu.
 * Esto ayuda a confirmar que la red privada está activa para recibir peticiones
 * de la App.
 */
@Component
@Slf4j
public class TailscaleStatusService implements CommandLineRunner {

    @Override
    public void run(String... args) {
        log.info("[Tailscale] Verificando estado de la red privada...");
        checkTailscaleStatus();
    }

    private void checkTailscaleStatus() {
        try {
            // Intentamos obtener la IP de Tailscale para confirmar conexión
            ProcessBuilder processBuilder = new ProcessBuilder("tailscale", "ip", "-4");
            Process process = processBuilder.start();

            boolean finished = process.waitFor(5, TimeUnit.SECONDS);
            if (finished && process.exitValue() == 0) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String ip = reader.readLine();
                    if (ip != null && !ip.isEmpty()) {
                        log.info("[Tailscale] Servidor activo en la red privada. IP: {}", ip);
                    } else {
                        log.warn("[Tailscale] Servicio detectado pero no se obtuvo IP.");
                    }
                }
            } else {
                log.error("[Tailscale] No se pudo obtener el estado. ¿Está Tailscale instalado y corriendo?");

                // Intento alternativo de diagnóstico
                log.debug("[Tailscale] Ejecutando diagnóstico detallado...");
                Process statusProc = new ProcessBuilder("tailscale", "status").start();
                try (BufferedReader errReader = new BufferedReader(
                        new InputStreamReader(statusProc.getInputStream()))) {
                    String line;
                    while ((line = errReader.readLine()) != null) {
                        log.debug("[Tailscale Status] {}", line);
                    }
                }
            }
        } catch (Exception e) {
            log.error("[Tailscale] Error al intentar comunicar con el servicio: {}", e.getMessage());
        }
    }
}
