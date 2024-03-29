package com.treningsplanlegging.treningsplanlegging.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.treningsplanlegging.treningsplanlegging.dto.SendMessageDto;
import com.treningsplanlegging.treningsplanlegging.entity.Chat;
import com.treningsplanlegging.treningsplanlegging.entity.Message;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.repository.MessageRepository;


@Service
public class MessageService {

	@Autowired
	private MessageRepository messageRepository;
	@Autowired
	private UserService userService;
	@Autowired
	private ChatService chatService;
	
	public Message sentMessage(SendMessageDto req) throws RuntimeException {
		
		User user = userService.findById(req.getUserId());
		Chat chat = chatService.findChatById(req.getChatId());
		
		Message message = new Message();
		message.setChat(chat);
		message.setUser(user);
		message.setContent(req.getContent());
		message.setTimestamp(LocalDateTime.now());
		Message message2 = messageRepository.save(message); 
		return message2;
	}

	public List<Message> getChatsMessages(Long chatId, User reqUser) throws RuntimeException {
		Chat chat = chatService.findChatById(chatId);
		
		if(!chat.getUsers().contains(reqUser)) {
			throw new RuntimeException("U Cant get this message, U are not related to this chat. :: "+chat.getId());
		}
		
		List<Message> messages = messageRepository.findByChatId(chat.getId());
		
		return messages;
	}

	public Message findMessageById(Long messageId) throws RuntimeException {
		Optional<Message> opt = messageRepository.findById(messageId);
		
		if(opt.isPresent()) {
			return opt.get();
		}
		 throw new RuntimeException(" Message not found with Id :: "+messageId);
	}

	public void deleteMessage(Long messageId, User reqUser) throws RuntimeException{
       Message message = findMessageById(messageId);
       
       if(message.getUser().getId().equals(reqUser.getId())) {
    	   messageRepository.deleteById(messageId);
       }
       throw new RuntimeException("you cant delete another users message  :: "+reqUser.getFirstName());
	}

}
