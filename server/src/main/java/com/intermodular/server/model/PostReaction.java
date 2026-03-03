package com.intermodular.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("post_reactions")
public class PostReaction {

    @Id
    private UUID id;

    @Column("post_id")
    private UUID postId;

    @Column("player_id")
    private UUID playerId;

    private String emoji;
}
