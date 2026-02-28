package com.avis.cliente.db;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "birds")
public class BirdEntity {
    @PrimaryKey(autoGenerate = false)
    @NonNull
    public String id; // UUID string

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
