# 01 Estrategia Técnica

## Stack Backend (Reactivo y No Bloqueante)
- **Framework Core:** Java 21 con Spring Boot 3 (WebFlux / Alternativa: Spring Web MVC + Virtual Threads)
- **Comunicación en Tiempo Real:** RSocket (Alternativa: WebSockets Clásicos STOMP)
- **Persistencia y Base de Datos:**
  - Supabase (PostgreSQL) usando estructura puramente relacional
  - Driver: Spring Data R2DBC (Asíncrono) (Alternativa: JPA/Hibernate)
- **Caché y Marketplace:** Spring Data Redis Reactive con Redisson (Distributed Locks)
- **Gestión de Identidad:** Spring Security Reactive + JWT
- **Procesamiento de Eventos:** RabbitMQ / Kafka

## Stack Frontend (Híbrido Web + Android)
- **Framework Core:** React 18 + Vite + TypeScript
- **Target Mobile:** Capacitor 6 → APK Android nativo con WebView
- **Gestión de Estado:** Zustand (singleton store con persistencia localStorage)
- **Estilos:** Tailwind CSS + CSS Variables (Glassmorphism, modo oscuro)
- **Router:** Zustand `currentScreen` (SPA sin React Router)
- **Capa Nativa Android:** Java puro con Hilt, Retrofit, RxJava3, Room, OkHttp

## Conectividad Cliente ↔ Servidor (Tailscale VPN)
- El servidor Spring Boot corre en una máquina Lubuntu (`100.112.239.82:8080`)
- El cliente Android se conecta a través de **Tailscale VPN** embebida (Go/tsnet)
- La librería Tailscale se compila como `.aar` con `gomobile bind` desde `tailscalebridge/`
- El plugin `TailscalePlugin.java` (Capacitor) inicia la VPN antes de cualquier llamada Retrofit

## APIs Externas Integradas
- **Nuthatch API:** Datos taxonómicos reales (nombre científico, familia, audios de cantos)
- **wttr.in:** API de clima ligera (sin API key) para `weather.ts`
- **Pexels API:** Imágenes de aves y hábitats
- **DiceBear API:** Avatares de usuario generados dinámicamente (`/api.dicebear.com`)

## Entorno de Desarrollo
- **Servidor remoto (Lubuntu):** Java 21, Maven, Docker (Redis, RabbitMQ/Kafka local)
- **Cliente (Windows):** Node.js, npm, Android Studio, Go, gomobile
- **Acceso remoto:** Tailscale VPN → SSH `ssh lubuntu@100.112.239.82`
- **Scripts de Build:** `tailscalebridge/build_aar.ps1` (compile + copy .aar)
