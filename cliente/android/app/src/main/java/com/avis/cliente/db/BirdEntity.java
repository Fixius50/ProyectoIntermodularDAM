package com.avis.cliente.db;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "birds", primaryKeys = {"id", "userId"})
public class BirdEntity {
    @NonNull
    public String id; // UUID string

    @NonNull
    public String userId; // UUID of the owner

    public String name;
    public String scientificName;
    public String birdType;
    public String rarity;
    public int hp;
    public int maxHp;
    public int stamina;
    public int maxStamina;
    public int canto;
    public int plumaje;
    public int vuelo;
    public int level;
    public int xp;
    public int maxXp;
    public String imageUrl;
    public String audioUrl;
    public String fact;
    public String origin;
    public String status; // Santuario, Expedicion, etc.
}
