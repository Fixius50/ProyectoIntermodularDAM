package com.example.backend.service;

import com.example.backend.domain.BirdRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class WikidataBirdService {

    private final WebClient webClient;

    public WikidataBirdService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://query.wikidata.org/sparql")
                .defaultHeader("Accept", "application/sparql-results+json")
                .defaultHeader("User-Agent", "AvisApp/1.0 (roberto@example.com)")
                .build();
    }

    public Flux<BirdRecord> searchBirds(String commonName) {
        String query = "SELECT ?bird ?birdLabel ?description ?image WHERE {" +
                "  ?bird wdt:P31 wd:Q16521; " + // Instance of taxon
                "        wdt:P171+ wd:Q717. " + // Descendant of Aves (birds)
                "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],es,en\". }" +
                "  FILTER(CONTAINS(LCASE(?birdLabel), LCASE(\"" + commonName + "\")))" +
                "} LIMIT 10";

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.queryParam("query", query).build())
                .retrieve()
                .bodyToMono(String.class)
                .flatMapMany(this::parseWikidataResponse);
    }

    private Flux<BirdRecord> parseWikidataResponse(String response) {
        // Implementación simplificada de parseo de SPARQL JSON
        // En una app real usaríamos una librería como Jackson o Gson con un DTO más complejo
        return Flux.just(
            BirdRecord.builder()
                .id(1L)
                .nombre("Pájaro de Prueba (Wikidata)")
                .descripcion("Descripción obtenida de Wikidata")
                .imagenUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Pica_pica_-_01.jpg/500px-Pica_pica_-_01.jpg")
                .build()
        );
    }
}
