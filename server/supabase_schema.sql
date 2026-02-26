-- Generado por el agente AntiGravity
-- Esquema inicial Reactivo de base de datos para AVIS - Tales of Flight
-- Ejecuta este script directamente en el panel SQLEditor de tu Supabase

-- Habilitar extensión pgcrypto para generar UUIDs seguros
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de Jugadores
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla Catálogo (Cartas de Pájaros maestras y Stats)
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

-- Tabla de Inventario de cada jugador (Un jugador y su carta capturada)
CREATE TABLE player_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    bird_card_id UUID REFERENCES bird_cards(id) ON DELETE CASCADE,
    captured_lat DOUBLE PRECISION,          
    captured_lon DOUBLE PRECISION,          
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para mejorar las consultas
CREATE INDEX idx_player_inv_player_id ON player_inventory(player_id);
CREATE INDEX idx_bird_name ON bird_cards(name);
