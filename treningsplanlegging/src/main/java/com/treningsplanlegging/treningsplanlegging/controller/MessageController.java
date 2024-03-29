package com.treningsplanlegging.treningsplanlegging.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.treningsplanlegging.treningsplanlegging.dto.SendMessageDto;
import com.treningsplanlegging.treningsplanlegging.entity.Message;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import com.treningsplanlegging.treningsplanlegging.service.MessageService;
import com.treningsplanlegging.treningsplanlegging.service.UserService;


@RestController
@RequestMapping("/api/messages")
public class MessageController {

	@Autowired
	private MessageService messageService;
	@Autowired
	private UserService userService;

    @Autowired
    private UserRepository userRepository;

	
	
	@PostMapping("/create")
	public ResponseEntity<Message> sentMessageHandler(@RequestBody SendMessageDto req) throws RuntimeException{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
	    
		User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
		req.setUserId(user.getId());
		Message sentMessage = messageService.sentMessage(req);
		System.out.println("Message sent successfully from "+user.getId());
		
		return new ResponseEntity<Message>(sentMessage, HttpStatus.OK);
		
	}
	
	@GetMapping("/chat/{chatId}")
	public ResponseEntity<List<Message>> GetChatMessagesHandler(@PathVariable Long chatId) throws RuntimeException{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
	    
		User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
		
		List<Message> messages = messageService.getChatsMessages(chatId, user);
		
		return new ResponseEntity<List<Message>>(messages, HttpStatus.OK);
		
	}
	
	@DeleteMapping("/{messageId}")
	public ResponseEntity<Boolean> deleteMessagesHandler(@PathVariable Long messageId) throws RuntimeException{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
	    
		User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + login));
		
		 messageService.deleteMessage(messageId, user);
		 
		
		return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		
	}
	
	
	
}
