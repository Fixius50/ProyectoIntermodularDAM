package com.avis.cliente.db;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import java.util.List;

import io.reactivex.rxjava3.core.Completable;
import io.reactivex.rxjava3.core.Single;

@Dao
public interface BirdDao {

    @Query("SELECT * FROM birds")
    Single<List<BirdEntity>> getAllBirds();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    Completable insertBirds(List<BirdEntity> birds);

    @Query("DELETE FROM birds")
    Completable deleteAllBirds();

    // Inventory
    @Query("SELECT * FROM inventory")
    Single<List<InventoryEntity>> getAllInventory();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    Completable insertInventory(List<InventoryEntity> items);

    @Query("DELETE FROM inventory")
    Completable deleteAllInventory();

    // Sightings
    @Query("SELECT * FROM sightings ORDER BY sightedAt DESC")
    Single<List<SightingEntity>> getAllSightings();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    Completable insertSighting(SightingEntity sighting);

    @Query("SELECT * FROM sightings WHERE isSynced = 0")
    Single<List<SightingEntity>> getPendingSightings();
}
