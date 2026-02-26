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
    Completable insertBird(BirdEntity bird);
}
