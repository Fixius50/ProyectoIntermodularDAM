package com.avis.cliente.db;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "birds")
public class BirdEntity {
    @PrimaryKey
    public int id;

    public String name;
    public String scientificName;
    public int attackPower;
    public String habitat;

    // Getters and Setters...
}
