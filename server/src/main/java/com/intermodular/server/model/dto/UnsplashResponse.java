package com.intermodular.server.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class UnsplashResponse {
    private List<Photo> results;

    @Data
    public static class Photo {
        private String id;
        private Urls urls;
        private String description;

        @Data
        public static class Urls {
            private String raw;
            private String full;
            private String regular;
            private String small;
            private String thumb;
        }
    }
}
