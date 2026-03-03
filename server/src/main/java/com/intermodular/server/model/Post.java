package com.intermodular.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
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

    // Cambiamos a LocalDateTime para que coincida con el Controller de tu compañero
    @Column("created_at")
    private LocalDateTime createdAt;

    // Usamos Integer (con I mayúscula) para que acepte nulls si tu compañero hace comprobaciones
    @Builder.Default
    private Integer likes = 0;

    @Column("comments_count")
    @Builder.Default
    private Integer commentsCount = 0;

    private String reactions;

    // Métodos puente para que no pete cuando busque "getUserId()"
    public UUID getUserId() {
        return this.playerId;
    }

    public void setUserId(UUID userId) {
        this.playerId = userId;
    }
}
