package com.avis.backend.service;

import reactor.core.publisher.Mono;

public interface WeatherService {
    /**
     * Get the current weather condition for a specific location.
     * @param lat latitude
     * @param lon longitude
     * @return A string representing the weather condition (e.g., "Clear", "Rain", "Clouds")
     */
    Mono<String> getCurrentWeather(double lat, double lon);
}

