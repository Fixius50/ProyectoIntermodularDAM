# Backend Technical Report & Integration Guide

This document provides a comprehensive overview of the AVIS backend architecture and services, intended for the backend developer to facilitate integration.

## 🏗️ Architecture Overview

The backend is built using a modern reactive stack:
- **Framework**: Spring Boot 3.4.3 (Downgraded from 4.0.3 for compatibility with Redisson and Spring Security).
- **Runtime**: Java 21.
- **Paradigm**: Reactive / Non-blocking (Project Reactor / WebFlux).
- **Database**: PostgreSQL via R2DBC (Supabase).
- **Messaging**: RabbitMQ.
- **Cache & Locks**: Redis + Redisson.
- **Communication**: REST for management, RSocket for real-time events (Battle/Expedition).

## 🛠️ Key Services

### 1. Expedition Service (`ExpedicionScreen` Integration)
- **Logic**: Handles starting, timing, and completing birdwatching expeditions.
- **Endpoints**:
  - `POST /api/expeditions/start`: Accepts `biome` and `bait`.
  - `GET /api/expeditions/status`: Retrieves current progress.
- **Integration Note**: The frontend currently uses a local timer; the backend should provide the source of truth for completion.

### 2. Crafting Service (`Taller` Integration)
- **Logic**: Manages the combination of "Foto", "Pluma", and "Notas" to create "Bird Cards".
- **Validation**: Ensures player has required materials in inventory.
- **Class**: `CraftingService.java`.

### 3. Inventory & Marketplace
- **InventoryService**: Handles resource counting (Seeds, Field Notes).
- **MarketplaceService**: Reactive stream of available items for trade.

### 4. External Integrations
- **WeatherService**: Retrieves real-time weather data (affects bird spawns).
- **WikidataBirdService**: Fetches bird metadata and images from open sources.

## 🔧 Database Schema
Managed via R2DBC. Main entities:
- `User`: Authentication and profile.
- `Inventory`: Resource tracking.
- `BirdCard`: Player collection.
- `Expedition`: State of active/past explorations.

## 🚀 Running the Backend
1. **Prerequisites**: Redis (6379) and RabbitMQ (5672) must be running.
2. **Execution**:
   ```bash
   ./mvnw spring-boot:run
   ```
3. **Logs**: Check `backend.log` for runtime issues.

## 📝 Recent Fixes (Done)
- **Incompatibility Fix**: Reverted to Spring Boot 3.4.3 to resolve `ClassNotFoundException` in `RedissonAutoConfigurationV2`.
- **Dependency Cleanup**: Fixed `pom.xml` test starters and versions.
