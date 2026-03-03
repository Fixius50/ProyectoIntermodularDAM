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

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("players")
public class Player implements Persistable<UUID> {

    @Id
    private UUID id;

    private String username;

    // ¡El culpable! Lo mapeamos a la columna correcta
    @Column("password_hash")
    private String password;

    @Builder.Default
    private Integer level = 1;

    @Builder.Default
    private Integer experience = 0;

    @Builder.Default
    private Integer feathers = 0;

    @Column("created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Si la app móvil envía un email, lo aceptamos pero NO lo metemos en BD
    @Transient
    private String email;

    // --- MAGIA PARA R2DBC ---
    @Transient
    @Builder.Default
    private boolean isNew = true;

    @Override
    public boolean isNew() {
        return isNew || id == null;
    }
}
