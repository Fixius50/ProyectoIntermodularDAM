7. Base de Datos (Supabase) y Persistencia Reactiva
Para el almacenamiento de datos persistentes y multimedia del juego, se utiliza Supabase (PostgreSQL). La arquitectura de la base de datos está diseñada para soportar las mecánicas principales de un TCG con geolocalización: gestión de usuarios, catálogo de cartas (estadísticas de los pájaros) y el inventario posicional.

7.1. Esquema Relacional (SQL)
Se ha implementado el siguiente esquema de datos directamente en el clúster de PostgreSQL de Supabase. El uso de UUID como clave primaria previene la enumeración de recursos y mejora la seguridad de la API.

SQL
-- 1. Tabla de Jugadores (Perfiles de usuario)
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla Catálogo: Estadísticas base de las cartas (Pájaros)
CREATE TABLE bird_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,      
    health INT NOT NULL DEFAULT 0,          
    attack_damage INT NOT NULL DEFAULT 0,   
    defense INT NOT NULL DEFAULT 0,         
    type VARCHAR(50),                       
    luck INT NOT NULL DEFAULT 0,            
    speed INT NOT NULL DEFAULT 0,           
    image_url TEXT,                         
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla Inventario: Relación N:M entre Jugador y Carta (con tracking GPS)
CREATE TABLE player_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    bird_card_id UUID REFERENCES bird_cards(id) ON DELETE CASCADE,
    captured_lat DOUBLE PRECISION,          
    captured_lon DOUBLE PRECISION,          
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
7.2. Almacenamiento Multimedia (Supabase Storage)
Para servir los assets gráficos (las imágenes de las cartas) a los dispositivos móviles sin sobrecargar el servidor backend, se ha configurado un Bucket público en Supabase Storage llamado bird-images. Los enlaces absolutos a estos recursos se almacenan en la columna image_url de la tabla bird_cards.

7.3. Mapeo Objeto-Relacional en Spring Boot (Entities)
Para que el backend interactúe con las tablas de forma asíncrona, se ha utilizado Spring Data R2DBC. Se han generado las clases de modelo (Entities) en el paquete com.avis.server.model, utilizando Lombok para automatizar la generación de constructores, getters y setters, manteniendo un código limpio.

Ejemplo del Modelo Principal: BirdCard.java

Java
package com.avis.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table("bird_cards")
public class BirdCard {
    
    @Id
    private UUID id;
    
    private String name;
    private Integer health;
    private Integer attackDamage; // Mapeado automáticamente a attack_damage en SQL
    private Integer defense;
    private String type;
    private Integer luck;
    private Integer speed;
    private String imageUrl;
    
    private Instant createdAt;
}
(Se han implementado de forma análoga las clases Player.java y PlayerInventory.java para reflejar sus respectivas tablas).

7.4. Capa de Acceso a Datos (R2DBC Repositories)
La persistencia se gestiona de forma 100% no bloqueante gracias a las interfaces R2dbcRepository. Spring Boot genera en tiempo de ejecución las consultas SQL subyacentes, devolviendo tipos de datos reactivos (Mono y Flux de Project Reactor).

Archivo de configuración (src/main/java/com/avis/server/repository/GameRepositories.java):

Java
package com.avis.server.repository;

import com.avis.server.model.BirdCard;
import com.avis.server.model.Player;
import com.avis.server.model.PlayerInventory;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import java.util.UUID;

public interface GameRepositories {

    // Repositorio reactivo para el catálogo de cartas
    interface BirdCardRepository extends R2dbcRepository<BirdCard, UUID> {}

    // Repositorio reactivo para la gestión de usuarios
    interface PlayerRepository extends R2dbcRepository<Player, UUID> {}

    // Repositorio reactivo para inventario y geolocalización
    interface PlayerInventoryRepository extends R2dbcRepository<PlayerInventory, UUID> {}

}
