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
@Table("sightings")
public class Sighting implements Serializable {

    @Id
    private UUID id;

    @Column("player_id")
    private UUID playerId;

    @Column("bird_card_id")
    private UUID birdCardId;

    private Double lat;
    private Double lon;

    @Column("audio_url")
    private String audioUrl;

    @Column("photo_url")
    private String photoUrl;

    private String notes;

    @Column("sighted_at")
    private OffsetDateTime sightedAt;

    private static final long serialVersionUID = 1L;
}
