package com.example.backend.service.impl;

import com.example.backend.service.WeatherService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class WeatherServiceImpl implements WeatherService {

    private final WebClient webClient;

    public WeatherServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.open-meteo.com/v1").build();
    }

    @Override
    public Mono<String> getCurrentWeather(double lat, double lon) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/forecast")
                        .queryParam("latitude", lat)
                        .queryParam("longitude", lon)
                        .queryParam("current_weather", true)
                        .build())
                .retrieve()
                .bodyToMono(WeatherResponse.class)
                .map(response -> {
                    double code = response.getCurrentWeather().getWeathercode();
                    return mapWmoCodeToCondition(code);
                })
                .onErrorResume(e -> Mono.just("Clear")); // Fallback
    }

    private String mapWmoCodeToCondition(double code) {
        if (code == 0) return "Clear";
        if (code >= 1 && code <= 3) return "Clouds";
        if (code >= 45 && code <= 48) return "Fog";
        if (code >= 51 && code <= 67) return "Rain";
        if (code >= 71 && code <= 77) return "Snow";
        if (code >= 80 && code <= 82) return "Showers";
        if (code >= 95) return "Thunderstorm";
        return "Clear";
    }

    private static class WeatherResponse {
        private CurrentWeather current_weather;
        public CurrentWeather getCurrentWeather() { return current_weather; }
        public void setCurrentWeather(CurrentWeather current_weather) { this.current_weather = current_weather; }

        private static class CurrentWeather {
            private double weathercode;
            public double getWeathercode() { return weathercode; }
            public void setWeathercode(double weathercode) { this.weathercode = weathercode; }
        }
    }
}
