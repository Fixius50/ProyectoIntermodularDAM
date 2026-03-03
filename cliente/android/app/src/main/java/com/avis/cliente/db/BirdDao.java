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

    @Query("SELECT * FROM birds WHERE userId = :userId")
    Single<List<BirdEntity>> getAllBirds(String userId);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    Completable insertBirds(List<BirdEntity> birds);

    @Query("DELETE FROM birds WHERE userId = :userId")
    Completable deleteAllBirds(String userId);

    // Inventory
    @Query("SELECT * FROM inventory WHERE userId = :userId")
    Single<List<InventoryEntity>> getAllInventory(String userId);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    Completable insertInventory(List<InventoryEntity> items);

    @Query("DELETE FROM inventory WHERE userId = :userId")
    Completable deleteAllInventory(String userId);

    // Sightings
    @Query("SELECT * FROM sightings WHERE userId = :userId ORDER BY sightedAt DESC")
    Single<List<SightingEntity>> getAllSightings(String userId);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    Completable insertSighting(SightingEntity sighting);

    @Query("SELECT * FROM sightings WHERE userId = :userId AND isSynced = 0")
    Single<List<SightingEntity>> getPendingSightings(String userId);
}
