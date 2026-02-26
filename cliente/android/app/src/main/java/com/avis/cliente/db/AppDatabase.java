package com.avis.cliente.db;

import androidx.room.Database;
import androidx.room.RoomDatabase;

@Database(entities = { BirdEntity.class }, version = 1, exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {
    public abstract BirdDao birdDao();
}
