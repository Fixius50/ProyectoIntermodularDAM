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
@Table("bandadas")
public class Bandada {

    @Id
    private UUID id;

    private String nombre;

    private String descripcion;

    @Column("lider_id")
    private UUID liderId;

    private Integer level;

    private String mission;

    @Column("mission_progress")
    private Integer missionProgress;

    @Column("mission_target")
    private Integer missionTarget;
}
