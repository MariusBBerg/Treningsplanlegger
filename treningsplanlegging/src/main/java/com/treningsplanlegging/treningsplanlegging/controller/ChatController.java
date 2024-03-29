package com.treningsplanlegging.treningsplanlegging.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.treningsplanlegging.treningsplanlegging.config.UserAuthenticationProvider;
import com.treningsplanlegging.treningsplanlegging.dto.GroupChatDto;
import com.treningsplanlegging.treningsplanlegging.dto.SingleChatDto;
import com.treningsplanlegging.treningsplanlegging.dto.UserDto;
import com.treningsplanlegging.treningsplanlegging.entity.Chat;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.repository.UserRepository;
import com.treningsplanlegging.treningsplanlegging.service.ChatService;
import com.treningsplanlegging.treningsplanlegging.service.UserService;

@RestController
@RequestMapping("/api/chats")

public class ChatController {

    @Autowired
	private UserService userService;
	
	@Autowired
	private ChatService chatService;

    @Autowired
    private UserAuthenticationProvider userAuthenticationProvider;

    @Autowired
    private UserRepository userRepository;
	
	@PostMapping("/single")
	public ResponseEntity<Chat> createChatHandler(@RequestBody SingleChatDto singleChatReq) throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
		User reqUser = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found with username: " + login));
		Chat chat = chatService.createChat(reqUser, singleChatReq.getUserId());
		
		return  new ResponseEntity<Chat>(chat, HttpStatus.OK);
	}
	
	@PostMapping("/group")
	public ResponseEntity<Chat> createGroupHandler(@RequestBody GroupChatDto groupChatReq) throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
		User reqUser = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found with username: " + login));

		System.out.println("Req Received for create grp"+ groupChatReq);
		
		Chat chat = chatService.createGroup(groupChatReq, reqUser);
		
		return  new ResponseEntity<Chat>(chat, HttpStatus.OK);
	}
	
	@GetMapping("/{chatId}")
	public ResponseEntity<Chat> findChatByIdHandler(@PathVariable Long chatId) throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
		Chat chat = chatService.findChatById(chatId);
		
		return  new ResponseEntity<Chat>(chat, HttpStatus.OK);
	}
	
	@GetMapping("/user")
	public ResponseEntity<List<Chat>> findAllChatsByUserIdHandler() throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
		User reqUser = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found with username: " + login));
		List<Chat> chat = chatService.findAllChatByUserId(reqUser.getId());
		
		return  new ResponseEntity<List<Chat>>(chat, HttpStatus.OK);
	}
	
	
	@PutMapping("/{chatId}/add/{userId}")
	public ResponseEntity<Chat> addUserToGroupHandler(@PathVariable Long chatId, @PathVariable Long UserId) throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
		User reqUser = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found with username: " + login));
		Chat chat = chatService.addUserToGroup(UserId, chatId, reqUser);
	
		return  new ResponseEntity<Chat>(chat, HttpStatus.OK);
	}
	
	@PutMapping("/{chatId}/remove/{userId}")
	public ResponseEntity<Chat> removeUserFromGroupHandler(@PathVariable Long chatId, @PathVariable Long UserId) throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
		User reqUser = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found with username: " + login));
		Chat chat = chatService.removeFromGroup(chatId, UserId, reqUser);
	
		return  new ResponseEntity<Chat>(chat, HttpStatus.OK);
	}
	
	@DeleteMapping("/delete/{chatId}")
	public ResponseEntity<Boolean> deleteChatHandler(@PathVariable Long chatId) throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String login = authentication.getName();
		User reqUser = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found with username: " + login));
		 chatService.deleteChat(chatId, reqUser.getId());
		 
	
		return  new ResponseEntity<Boolean>(true, HttpStatus.OK);
	}   
}
