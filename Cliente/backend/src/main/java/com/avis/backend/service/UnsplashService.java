package com.avis.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class UnsplashService {

    private final WebClient webClient;

    public UnsplashService(WebClient.Builder webClientBuilder, 
                           @Value("${avis.unsplash.api-key:NO_KEY}") String apiKey) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.unsplash.com")
                .defaultHeader("Authorization", "Client-ID " + apiKey)
                .build();
    }

    public Mono<String> getRandomBirdImage(String birdName) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/photos/random")
                        .queryParam("query", birdName + " bird")
                        .build())
                .retrieve()
                .bodyToMono(UnsplashResponse.class)
                .map(response -> response.urls.regular)
                .onErrorResume(e -> Mono.just("https://example.com/default-bird.jpg"));
    }

    private static class UnsplashResponse {
        public Urls urls;
        public static class Urls {
            public String regular;
        }
    }
}

