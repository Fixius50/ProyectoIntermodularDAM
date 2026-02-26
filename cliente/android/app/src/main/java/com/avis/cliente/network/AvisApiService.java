package com.avis.cliente.network;

import java.util.List;
import io.reactivex.rxjava3.core.Single;
import retrofit2.http.GET;

public interface AvisApiService {

    @GET("/api/birds/inventory")
    Single<List<Object>> getInventory();

    // Add other endpoints here
}
