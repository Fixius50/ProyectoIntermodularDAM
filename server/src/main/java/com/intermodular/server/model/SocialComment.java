package com.intermodular.server.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("social_comments")
public class SocialComment {
    @Id
    private UUID id;
    private UUID postId;
    private UUID userId;
    private String userName;
    private String avatar;
    private String text;
    private LocalDateTime timestamp;
}
