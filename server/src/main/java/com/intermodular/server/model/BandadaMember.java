package com.intermodular.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("bandada_members")
public class BandadaMember {

    @Column("bandada_id")
    private UUID bandadaId;

    @Column("player_id")
    private UUID playerId;

    @Column("joined_at")
    private LocalDateTime joinedAt;
}
