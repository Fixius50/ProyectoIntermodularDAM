package com.intermodular.server.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class NuthatchResponse {
    private List<Bird> entities;

    @Data
    public static class Bird {
        private String id;
        private String name;
        private String sciName;
        private String family;
        private String order;
        private int lengthMin;
        private int lengthMax;
        private int wingspanMin;
        private int wingspanMax;
        private List<String> images;
    }
}
