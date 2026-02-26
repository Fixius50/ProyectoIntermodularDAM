package com.avis.backend.service.impl;

import com.avis.backend.dto.AuctionItem;
import com.avis.backend.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RedissonReactiveClient;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketplaceServiceImpl implements MarketplaceService {

    private final ReactiveRedisTemplate<String, AuctionItem> redisTemplate;
    private final RedissonReactiveClient redissonClient;
    
    private static final String AUCTION_KEY_PREFIX = "auction:";

    @Override
    public Flux<AuctionItem> getAvailableAuctions() {
        return redisTemplate.keys(AUCTION_KEY_PREFIX + "*")
                .flatMap(redisTemplate.opsForValue()::get);
    }

    @Override
    public Mono<AuctionItem> createAuction(UUID sellerId, UUID birdCardId, int price) {
        String auctionId = UUID.randomUUID().toString();
        AuctionItem item = AuctionItem.builder()
                .auctionId(auctionId)
                .sellerId(sellerId)
                .birdCardId(birdCardId)
                .price(price)
                .status("OPEN")
                .build();
        
        return redisTemplate.opsForValue().set(AUCTION_KEY_PREFIX + auctionId, item)
                .thenReturn(item);
    }

    @Override
    public Mono<AuctionItem> buyItem(String auctionId, UUID buyerId) {
        String lockKey = "lock:auction:" + auctionId;
        
        // Uso de Redisson para bloqueo distribuido reactivo
        return redissonClient.getLock(lockKey).remainTimeToLive()
                .flatMap(ttl -> redissonClient.getLock(lockKey).lock())
                .then(redisTemplate.opsForValue().get(AUCTION_KEY_PREFIX + auctionId)
                        .flatMap(item -> {
                            if (!"OPEN".equals(item.getStatus())) {
                                return Mono.error(new IllegalStateException("Auction is no longer open"));
                            }
                            
                            item.setStatus("SOLD");
                            item.setBuyerId(buyerId);
                            
                            return redisTemplate.opsForValue().set(AUCTION_KEY_PREFIX + auctionId, item)
                                    .thenReturn(item);
                        }))
                .doFinally(signalType -> redissonClient.getLock(lockKey).unlock());
    }
}

