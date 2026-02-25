package com.avis.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table("bird_cards")
public class BirdCard {
    
    @Id
    private UUID id;
    
    private String name;
    private Integer health;
    private Integer attackDamage; // Spring traduce esto automáticamente a "attack_damage" en SQL
    private Integer defense;
    private String type;
    private Integer luck;
    private Integer speed;
    private String imageUrl;
    
    private Instant createdAt;
}
