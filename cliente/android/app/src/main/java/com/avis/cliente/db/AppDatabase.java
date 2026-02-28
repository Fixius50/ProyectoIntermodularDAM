package com.avis.cliente.db;

import androidx.room.Database;
import androidx.room.RoomDatabase;

@Database(entities = { BirdEntity.class, InventoryEntity.class, SightingEntity.class }, version = 2, exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {
    public abstract BirdDao birdDao();
}
