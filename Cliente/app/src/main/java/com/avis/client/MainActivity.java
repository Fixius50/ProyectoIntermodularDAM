package com.avis.client;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Actividad Principal Inicial del Emulador Android Nativo.
 * A partir de aqui se inyectara Dagger Hilt y la UI.
 */
// @dagger.hilt.android.AndroidEntryPoint (Se descomentara al configurar la App
// Hilt Application)
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main); // Layout XML
    }
}
