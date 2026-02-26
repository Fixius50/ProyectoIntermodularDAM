package com.avis.backend.config;

import com.avis.backend.service.EventPublisherService;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class initializing RabbitMQ entities.
 */
@Configuration
public class RabbitConfig {

    public static final String REWARD_EXCHANGE = "battle.rewards.exchange";

    @Bean
    public Queue rewardQueue() {
        // Durable queue
        return new Queue(EventPublisherService.REWARD_QUEUE, true);
    }

    @Bean
    public DirectExchange rewardExchange() {
        return new DirectExchange(REWARD_EXCHANGE);
    }

    @Bean
    public Binding binding(Queue rewardQueue, DirectExchange rewardExchange) {
        return BindingBuilder.bind(rewardQueue).to(rewardExchange).with(EventPublisherService.REWARD_QUEUE);
    }
}

