package com.avis.cliente.db;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "inventory", primaryKeys = {"id", "userId"})
public class InventoryEntity {
    @NonNull
    public String id; // UUID string

    @NonNull
    public String userId; // UUID of the owner

    public String name;
    public String icon;
    public int count;
    public String description;
}
