package com.avis.cliente.network;

import java.util.List;

import io.reactivex.rxjava3.core.Completable;
import io.reactivex.rxjava3.core.Single;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

/**
 * AvisApiService - Retrofit interface for the AVIS Spring Boot backend.
 *
 * All endpoints assume a valid JWT Bearer token is present in the
 * Authorization header (added via an OkHttp interceptor, to be implemented
 * in the auth sprint).
 *
 * Backend server: http://100.112.239.82:8080 (via Tailscale VPN)
 */
public interface AvisApiService {

    // -----------------------------------------------------------------------
    // Auth
    // -----------------------------------------------------------------------

    /** Register a new user account. */
    @POST("/api/auth/register")
    Single<AuthResponseDto> register(@Body RegisterRequestDto body);

    /** Log in with existing credentials. Returns a JWT. */
    @POST("/api/auth/login")
    Single<AuthResponseDto> login(@Body LoginRequestDto body);

    // -----------------------------------------------------------------------
    // Player Profile
    // -----------------------------------------------------------------------

    /** Retrieve the full player state (resources + collection + inventory). */
    @GET("/api/game-state")
    Single<GameStateDto> getGameState();

    /** Update the player's resource balances (seeds, fieldNotes, reputation). */
    @POST("/api/profile/resources")
    Single<ResourceUpdateResponseDto> updateResources(@Body ResourceUpdateDto body);

    // -----------------------------------------------------------------------
    // Bird Collection (Álbum)
    // -----------------------------------------------------------------------

    /** Return all bird cards owned by the current user. */
    @GET("/api/collection")
    Single<List<BirdCardDto>> getCollection();

    /** Record a newly discovered bird in the user's collection. */
    @POST("/api/expedition/discover")
    Single<BirdCardDto> discoverBird(@Body DiscoverBirdDto body);

    /** Add XP to a bird after winning a battle. */
    @PUT("/api/collection/{birdId}/xp")
    Single<BirdCardDto> addBirdXp(@Path("birdId") String birdId, @Body XpUpdateDto body);

    // -----------------------------------------------------------------------
    // Inventory (Taller)
    // -----------------------------------------------------------------------

    /** Get raw materials available to the player. */
    @GET("/api/inventory")
    Single<InventoryDto> getInventory();

    /** Consume materials and craft a new bird card. */
    @POST("/api/crafting/craft")
    Single<BirdCardDto> craftBird(@Body CraftRequestDto body);

    // -----------------------------------------------------------------------
    // Expedition
    // -----------------------------------------------------------------------

    /** Start a timed expedition in a given biome with a bait. */
    @POST("/api/expeditions/start")
    Single<ExpeditionStatusDto> startExpedition(@Body StartExpeditionDto body);

    /** Get the current expedition status (ongoing or finished). */
    @GET("/api/expeditions/current")
    Single<ExpeditionStatusDto> getExpeditionStatus();

    /** Claim the rewards once the expedition timer has completed. */
    @POST("/api/expeditions/claim")
    Single<ExpeditionRewardDto> claimExpeditionReward();

    // -----------------------------------------------------------------------
    // Certamen (Battle)
    // -----------------------------------------------------------------------

    /** Resolve a battle action on the server side. */
    @POST("/api/battle/attack")
    Single<BattleResultDto> attack(@Body BattleAttackDto body);

    // -----------------------------------------------------------------------
    // Sanctuary
    // -----------------------------------------------------------------------

    /** Feed a bird in the sanctuary, spending seeds and gaining affinity. */
    @POST("/api/sanctuary/feed")
    Single<FeedResultDto> feedBird(@Body FeedBirdDto body);

    // -----------------------------------------------------------------------
    // DTOs (inner static classes for simplicity — can be split to own files)
    // -----------------------------------------------------------------------

    class LoginRequestDto {
        public String email;
        public String password;
        public LoginRequestDto(String email, String password) {
            this.email = email; this.password = password;
        }
    }

    class RegisterRequestDto {
        public String name;
        public String email;
        public String password;
        public RegisterRequestDto(String name, String email, String password) {
            this.name = name; this.email = email; this.password = password;
        }
    }

    class AuthResponseDto {
        public String token;
        public String userId;
    }

    class GameStateDto {
        public Object player;
        public List<Object> materials;
        public List<Object> craftItems;
        public List<Object> collection;
    }

    class ResourceUpdateDto {
        public int seeds;
        public int fieldNotes;
        public int reputation;
    }

    class ResourceUpdateResponseDto {
        public int newSeeds;
        public int newFieldNotes;
        public int newReputation;
    }

    class BirdCardDto {
        public String id;
        public String birdId;
        public int level;
        public int xp;
        public int xpToNextLevel;
        public String status;
    }

    class DiscoverBirdDto {
        public String birdId;
        public DiscoverBirdDto(String birdId) { this.birdId = birdId; }
    }

    class XpUpdateDto {
        public int xpAdded;
        public XpUpdateDto(int xpAdded) { this.xpAdded = xpAdded; }
    }

    class InventoryDto {
        public List<Object> materials;
        public List<Object> craftItems;
    }

    class CraftRequestDto {
        public String recipeId;
        public CraftRequestDto(String recipeId) { this.recipeId = recipeId; }
    }

    class StartExpeditionDto {
        public String biome;
        public String bait;
        public StartExpeditionDto(String biome, String bait) {
            this.biome = biome; this.bait = bait;
        }
    }

    class ExpeditionStatusDto {
        public String biome;
        public String bait;
        public long startTime;
        public String status;
    }

    class ExpeditionRewardDto {
        public List<String> discoveredBirdIds;
        public List<Object> materials;
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

    class FeedBirdDto {
        public String birdId;
        public int seedCost;
        public FeedBirdDto(String birdId, int seedCost) {
            this.birdId = birdId; this.seedCost = seedCost;
        }
    }

    class FeedResultDto {
        public boolean success;
        public int newSeeds;
        public int newAffinity;
    }
}
