8. Evolución de la Arquitectura: APIs Externas y Brokers de Mensajería
Para soportar las nuevas mecánicas de juego (Mercado, Crafteo, Batallas en tiempo real y Bandadas), la arquitectura del servidor backend se ha expandido, integrando servicios locales para la gestión de colas y bloqueos de concurrencia, así como llamadas a APIs externas para enriquecer el mundo de juego.

8.1. Nuevas Dependencias de Infraestructura (Lubuntu)
El servidor ahora requiere dos servicios adicionales corriendo en segundo plano:

RabbitMQ: Actúa como Message Broker para gestionar de forma asíncrona los eventos del juego (como el reparto de recompensas) sin bloquear los hilos principales de ejecución.

Redis: Base de datos en memoria (Caché) utilizada por Redisson para gestionar Locks (bloqueos distribuidos) en el Marketplace, previniendo condiciones de carrera si dos usuarios intentan comprar el mismo ítem simultáneamente.

Comandos de instalación y despliegue:

Bash
sudo apt update
sudo apt install redis-server rabbitmq-server -y
sudo systemctl enable --now redis-server
sudo systemctl enable --now rabbitmq-server
8.2. Integración de APIs Externas (World Building)
El motor de juego se alimenta de datos del mundo real mediante las siguientes APIs REST:

OpenWeatherMap: Obtiene el clima real en las coordenadas del jugador, influyendo dinámicamente en el tipo de aves que pueden aparecer (ej. aves acuáticas durante la lluvia).

Wikidata / Unsplash: Proveen de forma dinámica información taxonómica e imágenes de alta calidad (libres de derechos) para poblar el catálogo de aves en caso de no disponer de arte nativo.

Nuthatch API: Base de datos ornitológica mundial empleada para validar y extraer estadísticas base de las especies reales.

8.3. Archivo de Configuración Definitivo (application.yml)
Toda la configuración de red (preparada para la VPN Tailscale), seguridad JWT, credenciales de base de datos y APIs externas se centraliza en el archivo src/main/resources/application.yml:

YAML
spring:
  application:
    name: AvisBackend

  # Conexión asíncrona a Supabase (PostgreSQL)
  r2dbc:
    url: r2dbc:postgresql://db.shmutxsmjokamnxrkufe.supabase.co:5432/postgres
    username: postgres
    password: ${DB_PASSWORD}

  # Message Broker para eventos asíncronos
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest

  # Caché en memoria para Locks de Subastas
  data:
    redis:
      host: localhost
      port: 6379

  # Configuración del Servidor RSocket (Batallas) - Escucha global para VPN
  rsocket:
    server:
      port: 7000
      transport: tcp
      address: 0.0.0.0

# API REST Estándar - Escucha global para VPN
server:
  port: 8080
  address: 0.0.0.0

# Credenciales de APIs Externas
api:
  weather:
    url: "https://api.openweathermap.org/data/2.5"
    key: "${WEATHER_API_KEY}"
  unsplash:
    url: "https://api.unsplash.com"
    key: "${UNSPLASH_ACCESS_KEY}"
  nuthatch:
    url: "https://nuthatch.lastelm.software"
    key: "${NUTHATCH_API_KEY}"

# Seguridad y firma de tokens
jwt:
  secret: "UnaClaveSecretaMuyLargaYComplejaParaFirmarLosTokensDeAvis2026"
  expiration: 86400000 # 24 horas
8.4. Troubleshooting: Permisos de Ejecución (Maven Wrapper)
En sistemas basados en Linux, es común que al clonar o actualizar repositorios, los scripts pierdan sus permisos de ejecución.

Error: bash: ./mvnw: Permiso denegado

Causa: El sistema operativo bloquea la ejecución del script por motivos de seguridad.

Solución: Otorgar permisos de ejecución al archivo antes de compilar:

Bash
chmod +x mvnw
8.5. Ciclo de Compilación y Despliegue Estándar
Cada vez que se actualiza el código o la configuración (.yml), el proceso seguro de reconstrucción en el servidor de producción es:

Bash
# 1. Empaquetar el nuevo .jar omitiendo los tests para mayor rapidez
./mvnw clean package -DskipTests

# 2. Reiniciar el demonio del sistema para inyectar la nueva versión
sudo systemctl restart avis-server.service

# 3. Monitorizar la correcta conexión a Redis, RabbitMQ y Supabase
sudo journalctl -u avis-server.service -f
