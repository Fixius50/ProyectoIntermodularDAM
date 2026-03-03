package com.intermodular.server.service;

import com.intermodular.server.model.Bandada;
import com.intermodular.server.repository.BandadaMemberRepository;
import com.intermodular.server.repository.BandadaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BandadaService {

    private final BandadaRepository bandadaRepository;
    private final BandadaMemberRepository memberRepository;

    public Flux<Bandada> getAllGuilds() {
        return bandadaRepository.findAll();
    }

    public Mono<Bandada> getGuildById(UUID id) {
        return bandadaRepository.findById(id);
    }

    public Mono<Bandada> createGuild(Bandada bandada) {
        return bandadaRepository.save(bandada)
                .flatMap(saved -> memberRepository.addMember(saved.getId(), saved.getLiderId())
                        .thenReturn(saved));
    }

    public Mono<Void> joinGuild(UUID bandadaId, UUID playerId) {
        return memberRepository.addMember(bandadaId, playerId).then();
    }
}
