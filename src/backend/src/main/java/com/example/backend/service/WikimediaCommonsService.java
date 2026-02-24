package com.example.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class WikimediaCommonsService {

    private final WebClient webClient;

    public WikimediaCommonsService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://commons.wikimedia.org/w/api.php")
                .build();
    }

    public Mono<String> getBirdImage(String birdName) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("action", "query")
                        .queryParam("format", "json")
                        .queryParam("prop", "pageimages")
                        .queryParam("titles", FileMapping(birdName))
                        .queryParam("pithumbsize", 500)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .map(res -> "https://example.com/parsed-wiki-image.jpg") // Placeholder logic
                .onErrorResume(e -> Mono.just("https://example.com/default.jpg"));
    }

    private String FileMapping(String name) {
        return "File:" + name.replace(" ", "_") + ".jpg";
    }
}
