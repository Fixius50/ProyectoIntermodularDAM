package com.avis.cliente.db;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "sightings")
public class SightingEntity {
    @PrimaryKey(autoGenerate = false)
    public String id; // UUID string

    public String birdCardId;
    public double lat;
    public double lon;
    public String localAudioPath;
    public String audioUrl; // Remote URL after sync
    public String localPhotoPath;
    public String photoUrl; // Remote URL after sync
    public String notes;
    public long sightedAt;
    public boolean isSynced;
}
