package com.treningsplanlegging.treningsplanlegging.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.treningsplanlegging.treningsplanlegging.dto.MessageDto;
import com.treningsplanlegging.treningsplanlegging.entity.Message;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.repository.MessageRepository;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;

@Controller
public class ChatController {

    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageRepository messageRepository;


    @Autowired
    public ChatController(SimpMessagingTemplate simpMessagingTemplate, MessageRepository messageRepository, UserRepository userRepository) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @MessageMapping("/private-message")
    public MessageDto receivePrivateMessage(@Payload MessageDto messageDto) {

        
        simpMessagingTemplate.convertAndSendToUser(messageDto.getReceiver().getLogin(),"/private",messageDto);
        Message message = convertDtoToEntity(messageDto);
        messageRepository.save(message);
        return messageDto;
    }

        private Message convertDtoToEntity(MessageDto messageDto) {
        Message message = new Message();
        User sender = userRepository.findByLogin(messageDto.getSender().getLogin()).get();
        User receiver = userRepository.findByLogin(messageDto.getReceiver().getLogin()).get();

        message.setMessage(messageDto.getMessage());
        message.setSender(sender);
        message.setReceiver(receiver);
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        try {
            Date date = format.parse(messageDto.getDate());
            message.setDate(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return message;
    }
    
    
}