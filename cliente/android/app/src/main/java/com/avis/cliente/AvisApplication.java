package com.avis.cliente;

import android.app.Application;
import dagger.hilt.android.HiltAndroidApp;

@HiltAndroidApp
public class AvisApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        // Initialize global configurations here if needed
    }
}
