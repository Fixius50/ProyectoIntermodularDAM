-- Generado por AntiGravity
-- Esquema de base de datos V2 para AVIS - Tales of Flight adaptado a Supabase
-- Ejecutar en el panel SQL Editor de Supabase.

-- Habilitar extensión pgcrypto para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. PERFILES DE USUARIO
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- En producción, idealmente se linkea con auth.users de Supabase
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar_url TEXT, -- Puede apuntar al storage de Supabase o una URL externa
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    feathers INT DEFAULT 0, -- Moneda del juego (Plumas)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. CATÁLOGO GLOBAL DE AVES (Las 6 iniciales y futuras)
-- ==========================================
-- Contiene las estadísticas base y la media oficial proveída por el servidor.
CREATE TABLE global_birds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    scientific_name VARCHAR(150),
    type VARCHAR(50) NOT NULL, -- Ej: 'Water', 'Raptor', 'Songbird'
    base_hp INT NOT NULL DEFAULT 100,
    base_stamina INT NOT NULL DEFAULT 100,
    base_canto INT NOT NULL DEFAULT 10,
    base_vuelo INT NOT NULL DEFAULT 10,
    base_plumaje INT NOT NULL DEFAULT 10,
    default_image_url TEXT, -- URL de la foto oficial (ej. servida desde el backend o Wikipedia cacheada)
    default_audio_url TEXT, -- URL del audio oficial (ej. servida desde el backend o Xeno-canto)
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. AVES CAPTURADAS POR LOS JUGADORES (Progresión RPG)
-- ==========================================
-- Cada captura instancia un pájaro único para el usuario con sus propias estadísticas que suben de nivel.
CREATE TABLE user_birds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bird_id UUID REFERENCES global_birds(id) ON DELETE CASCADE,
    
    -- Estado RPG dinámico
    level INT DEFAULT 1,
    current_xp INT DEFAULT 0,
    max_xp INT DEFAULT 1000,
    current_hp INT,
    max_hp INT,
    current_stamina INT,
    max_stamina INT,
    
    -- Atributos de certamen mutables por nivel o entrenamiento
    canto INT,
    vuelo INT,
    plumaje INT,
    
    -- Estado en el juego ('Santuario' o 'Expedicion')
    status VARCHAR(50) DEFAULT 'Santuario',
    
    -- Personalización
    nickname VARCHAR(50),
    custom_image_url TEXT, -- Si el usuario subió una foto propia de este pájaro
    
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Índices
    CONSTRAINT user_bird_fk UNIQUE(user_id, bird_id, captured_at)
);

-- ==========================================
-- 4. MEDIA SUBIDA POR EL USUARIO (User Generated Content)
-- ==========================================
-- Registro de todas las fotos y audios que los usuarios suben a la plataforma (vía Supabase Storage).
CREATE TABLE user_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('IMAGE', 'AUDIO')),
    storage_path TEXT NOT NULL, -- Ruta en el bucket Supabase Ej: 'user_uploads/img_123.jpg'
    public_url TEXT NOT NULL,
    
    -- Contexto (¿A qué pertenece esta foto/audio?)
    context_type VARCHAR(50), -- 'PROFILE_AVATAR', 'BIRD_SIGHTING', 'SOCIAL_POST'
    reference_id UUID, -- ID de la tabla correspondiente al contexto (ej. id de un user_bird)
    
    approved BOOLEAN DEFAULT true, -- Para futura moderación
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ÍNDICES DE OPTIMIZACIÓN
-- ==========================================
CREATE INDEX idx_user_birds_userid ON user_birds(user_id);
CREATE INDEX idx_user_media_userid ON user_media(user_id);
CREATE INDEX idx_global_birds_type ON global_birds(type);
