package com.intermodular.server.service;

import com.intermodular.server.model.dto.NuthatchResponse;
import com.intermodular.server.model.dto.UnsplashResponse;
import com.intermodular.server.model.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ExternalApiService {

    private final WebClient webClient;

    // OpenWeatherMap
    @Value("${api.weather.url}")
    private String weatherUrl;
    @Value("${api.weather.key}")
    private String weatherKey;

    // Unsplash
    @Value("${api.unsplash.url}")
    private String unsplashUrl;
    @Value("${api.unsplash.key}")
    private String unsplashKey;

    // Nuthatch
    @Value("${api.nuthatch.url}")
    private String nuthatchUrl;
    @Value("${api.nuthatch.key}")
    private String nuthatchKey;

    public ExternalApiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Consulta el clima actual para unas coordenadas geográficas.
     */
    public Mono<WeatherResponse> getCurrentWeather(double lat, double lon) {
        return webClient.get()
                .uri(weatherUrl + "/weather?lat={lat}&lon={lon}&appid={key}&units=metric", lat, lon, weatherKey)
                .retrieve()
                .bodyToMono(WeatherResponse.class);
    }

    /**
     * Busca fotos genericas mediante palabras clave (útil para fondos de batallas).
     */
    public Mono<UnsplashResponse> searchPhotos(String query) {
        return webClient.get()
                .uri(unsplashUrl + "/search/photos?query={query}&client_id={key}", query, unsplashKey)
                .retrieve()
                .bodyToMono(UnsplashResponse.class);
    }

    /**
     * Devuelve una lista de pajaros desde la API externa global Nuthatch (para
     * poblar Supabase).
     */
    public Mono<NuthatchResponse> fetchBirds() {
        return webClient.get()
                .uri(nuthatchUrl + "/v2/birds")
                .header("api-key", nuthatchKey)
                .retrieve()
                .bodyToMono(NuthatchResponse.class);
    }
}
