package com.intermodular.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("players")
public class Player implements Persistable<UUID>, Serializable {

    @Id
    private UUID id;
    
    private String username;

    @Column("password_hash")
    private String passwordHash;

    @Builder.Default
    private int level = 1;

    @Column("experience")
    @Builder.Default
    private int experience = 0;

    @Column("feathers")
    @Builder.Default
    private int feathers = 10;

    @Column("created_at")
    private OffsetDateTime createdAt;

    // --- MAGIA PARA R2DBC ---
    // Obligamos a Spring a hacer INSERT la primera vez
    @Transient
    @Builder.Default
    private boolean isNewRecord = true;

    @Override
    @Transient
    public boolean isNew() {
        return this.isNewRecord || id == null;
    }

    private static final long serialVersionUID = 1L;
}
