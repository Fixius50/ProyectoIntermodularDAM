package com.intermodular.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.io.Serializable;
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
    private int attack;
    private int defense;
    private int speed;
    private String element;

    // Default serial id para Redis serialization
    private static final long serialVersionUID = 1L;
}
