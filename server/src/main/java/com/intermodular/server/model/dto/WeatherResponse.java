package com.intermodular.server.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class WeatherResponse {
    private List<Weather> weather;
    private Main main;
    private String name;

    @Data
    public static class Weather {
        private String main;
        private String description;
        private String icon;
    }

    @Data
    public static class Main {
        private double temp;
        private double humidity;
    }
}
