package com.intermodular.server.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@AllArgsConstructor
@Slf4j
public class SecurityContextRepository implements ServerSecurityContextRepository {

    private final JwtAuthenticationManager authenticationManager;

    @Override
    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Mono<SecurityContext> load(ServerWebExchange exchange) {
        ServerHttpRequest request = exchange.getRequest();
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        String path = request.getPath().value();
        log.debug("[SecurityContextRepository] Cargando contexto para ruta: {}", path);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            log.info("[SecurityContextRepository] Token detectado en cabecera Authorization para ruta: {}", path);
            String token = authHeader.substring(7);
            Authentication auth = new UsernamePasswordAuthenticationToken(token, token);
            return this.authenticationManager.authenticate(auth).map(SecurityContextImpl::new);
        }

        log.trace("[SecurityContextRepository] No se detectó cabecera Bearer en ruta: {}", path);
        return Mono.empty();
    }
}
