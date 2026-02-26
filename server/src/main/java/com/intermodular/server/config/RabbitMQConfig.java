package com.intermodular.server.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String MATCHMAKING_QUEUE = "matchmaking_queue";
    public static final String MATCHMAKING_EXCHANGE = "matchmaking_exchange";
    public static final String MATCHMAKING_ROUTING_KEY = "matchmaking_rt_key";

    @Bean
    public Queue queue() {
        return new Queue(MATCHMAKING_QUEUE, true);
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(MATCHMAKING_EXCHANGE);
    }

    @Bean
    public Binding binding(Queue queue, DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(MATCHMAKING_ROUTING_KEY);
    }
}
