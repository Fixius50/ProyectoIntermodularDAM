package com.intermodular.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.io.Serializable;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("bandadas")
public class Bandada implements Serializable {

    @Id
    private UUID id;
    private String nombre;
    private String descripcion;

    @Column("lider_id")
    private UUID liderId;

    @Builder.Default
    private int level = 1;

    private String mission;

    @Column("mission_progress")
    @Builder.Default
    private int missionProgress = 0;

    @Column("mission_target")
    @Builder.Default
    private int missionTarget = 50;

    // Transient: se rellena al obtener los miembros
    private transient int memberCount;

    private static final long serialVersionUID = 1L;
}
