package com.avis.cliente.network;

import java.util.List;
import java.util.Map;

import io.reactivex.rxjava3.core.Completable;
import io.reactivex.rxjava3.core.Single;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

/**
 * AvisApiService - Retrofit interface for the AVIS Spring Boot backend.
 */
public interface AvisApiService {

    // -----------------------------------------------------------------------
    // Auth
    // -----------------------------------------------------------------------

    @POST("/api/auth/register")
    Single<AuthResponseDto> register(@Body Map<String, String> body);

    @POST("/api/auth/login")
    Single<AuthResponseDto> login(@Body Map<String, String> body);

    // -----------------------------------------------------------------------
    // Player Profile
    // -----------------------------------------------------------------------

    @GET("/api/players/me")
    Single<Map<String, Object>> getPlayerProfile();

    @PUT("/api/players/me")
    Single<Map<String, Object>> updatePlayerProfile(@Body Map<String, Integer> body);

    // -----------------------------------------------------------------------
    // Bird Collection & Catalog
    // -----------------------------------------------------------------------

    @GET("/api/public/birds")
    Single<List<Map<String, Object>>> getBirdCatalog();

    // -----------------------------------------------------------------------
    // Social / Posts
    // -----------------------------------------------------------------------

    @GET("/api/posts")
    Single<List<Map<String, Object>>> getFeed();

    @POST("/api/posts")
    Single<Map<String, Object>> createPost(@Body Map<String, Object> body);

    // -----------------------------------------------------------------------
    // Bandadas (Guilds)
    // -----------------------------------------------------------------------

    @GET("/api/bandadas")
    Single<List<Map<String, Object>>> getBandadas();

    @PUT("/api/bandadas/{id}/join")
    Completable joinBandada(@Path("id") String id);

    // -----------------------------------------------------------------------
    // Sightings
    // -----------------------------------------------------------------------

    @POST("/api/sightings")
    Single<Map<String, Object>> registerSighting(@Body Map<String, Object> body);

    // -----------------------------------------------------------------------
    // Battle
    // -----------------------------------------------------------------------

    @POST("/api/battle/attack")
    Single<BattleResultDto> attack(@Body BattleAttackDto body);

    // -----------------------------------------------------------------------
    // DTOs
    // -----------------------------------------------------------------------

    class AuthResponseDto {
        public String token;
        public Map<String, Object> player;
    }

    class BattleAttackDto {
        public String move;
        public String birdId;
        public BattleAttackDto(String move, String birdId) {
            this.move = move; this.birdId = birdId;
        }
    }

    class BattleResultDto {
        public String result;
        public String log;
        public int damage;
    }
}
