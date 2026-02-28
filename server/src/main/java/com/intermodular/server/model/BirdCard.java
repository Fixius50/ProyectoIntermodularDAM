package com.intermodular.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.io.Serializable;
import java.time.OffsetDateTime;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("bird_cards")
public class BirdCard implements Serializable {

    @Id
    private UUID id;
    private String name;

    @Column("scientific_name")
    private String scientificName;

    // Game stats stored in DB (Supabase columns)
    private int health;

    @Column("attack_damage")
    private int attackDamage;

    private int defense;
    private int luck;
    private int speed;
    private String type; // original column (kept for BattleController)

    @Column("bird_type")
    private String birdType; // Songbird / Raptor / Flight / Plumage

    private String rarity; // common / uncommon / rare / legendary

    // Extended game stats
    private int hp;
    @Column("max_hp")
    private int maxHp;
    private int stamina;
    @Column("max_stamina")
    private int maxStamina;
    private int canto;
    private int plumaje;
    private int vuelo;
    @Column("max_xp")
    private int maxXp;

    @Column("image_url")
    private String imageUrl;

    @Column("audio_url")
    private String audioUrl;

    private String fact;
    private String origin;

    @Column("preferred_phase")
    private String[] preferredPhase;

    @Column("preferred_weather")
    private String[] preferredWeather;

    @Column("created_at")
    private OffsetDateTime createdAt;

    private static final long serialVersionUID = 1L;
}
