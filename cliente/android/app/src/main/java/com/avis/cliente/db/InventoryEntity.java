package com.avis.cliente.db;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "inventory")
public class InventoryEntity {
    @PrimaryKey(autoGenerate = false)
    public String id; // UUID string

    public String name;
    public String icon;
    public int count;
    public String description;
}
