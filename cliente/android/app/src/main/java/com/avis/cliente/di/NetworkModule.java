package com.avis.cliente.di;

import android.content.Context;

import com.avis.cliente.network.AvisApiService;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.android.qualifiers.ApplicationContext;
import dagger.hilt.components.SingletonComponent;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.adapter.rxjava3.RxJava3CallAdapterFactory;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * NetworkModule - Hilt module providing Retrofit, OkHttp and AvisApiService.
 *
 * The BASE_URL points to the Spring Boot server via Tailscale VPN.
 * The Tailscale node must be initialised (via TailscalePlugin.initTailscale)
 * before any network calls are made, so that traffic can flow through the VPN.
 *
 * Server IP: 100.112.239.82 (Tailscale address of the Lubuntu dev server)
 * Server Port: 8080 (Spring Boot API)
 */
@Module
@InstallIn(SingletonComponent.class)
public class NetworkModule {

    // Tailscale IP of the AVIS Spring Boot server (Lubuntu machine).
    // This address is only reachable once the Tailscale node is active on the
    // device.
    private static final String BASE_URL = "http://100.112.94.34:8080/";

    // Auth Constants
    private static final String PREFS_FILE = "aery_secure_prefs";
    private static final String TOKEN_KEY = "jwt_token";

    @Provides
    @Singleton
    public OkHttpClient provideOkHttpClient(@ApplicationContext Context context) {
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor(message -> android.util.Log.d("AvisNetwork", message));
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        return new OkHttpClient.Builder()
                .addInterceptor(logging)
                .addInterceptor(chain -> {
                    Request original = chain.request();
                    android.util.Log.d("AvisNetwork", "--> PETICIÓN NATIVA: " + original.url());
                    Request.Builder builder = original.newBuilder();

                    // 1. Persistencia de JWT (Interceptor de Seguridad)
                    String token = context.getSharedPreferences(PREFS_FILE, Context.MODE_PRIVATE)
                            .getString(TOKEN_KEY, null);

                    if (token != null && !token.isEmpty()) {
                        builder.header("Authorization", "Bearer " + token);
                    }

                    return chain.proceed(builder.build());
                })
                .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
                .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
                .build();
    }

    @Provides
    @Singleton
    public Retrofit provideRetrofit(OkHttpClient okHttpClient) {
        return new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .addCallAdapterFactory(RxJava3CallAdapterFactory.create())
                .build();
    }

    @Provides
    @Singleton
    public AvisApiService provideApiService(Retrofit retrofit) {
        return retrofit.create(AvisApiService.class);
    }
}
