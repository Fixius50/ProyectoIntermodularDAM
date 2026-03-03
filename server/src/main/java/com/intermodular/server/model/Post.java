package com.intermodular.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("posts")
public class Post {

    @Id
    private UUID id;

    @Column("player_id")
    private UUID playerId;

    @Column("bird_id")
    private UUID birdId;

    private String text;

    @Column("image_url")
    private String imageUrl;

    private String location;

    @Column("created_at")
    private ZonedDateTime createdAt;
}
