package com.treningsplanlegging.treningsplanlegging.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.treningsplanlegging.treningsplanlegging.entity.Message;

public class RealtimeChatController {
    @Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@Autowired
    public RealtimeChatController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/message")
    public void receiveMessage(@Payload Message message) {
        // Log the received message for debugging purposes
        System.out.println("Received message: " + message.getContent() + " in chatId: " + message.getChat().getId());
        
        // Redirects the message to a specific chat group topic
        simpMessagingTemplate.convertAndSend("/group/" + message.getChat().getId(), message);
    }
}
