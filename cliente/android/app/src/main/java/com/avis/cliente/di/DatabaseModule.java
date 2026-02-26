package com.avis.cliente.di;

import android.content.Context;

import androidx.room.Room;

import com.avis.cliente.db.AppDatabase;
import com.avis.cliente.db.BirdDao;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.android.qualifiers.ApplicationContext;
import dagger.hilt.components.SingletonComponent;

@Module
@InstallIn(SingletonComponent.class)
public class DatabaseModule {

    @Provides
    @Singleton
    public AppDatabase provideDatabase(@ApplicationContext Context context) {
        return Room.databaseBuilder(context, AppDatabase.class, "avis_offline_db")
                .fallbackToDestructiveMigration()
                .build();
    }

    @Provides
    @Singleton
    public BirdDao provideBirdDao(AppDatabase database) {
        return database.birdDao();
    }
}
