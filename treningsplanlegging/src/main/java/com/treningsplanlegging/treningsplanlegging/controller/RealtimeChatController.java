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

	@MessageMapping("/message")
	@SendTo("/group/public")
	public Message receiveMessage(@Payload Message message) {
		System.out.println("Received message: " + message);
		simpMessagingTemplate.convertAndSend("/group/"+message.getChat().getId().toString(), message);
		return message;
	}
}
