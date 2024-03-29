package com.treningsplanlegging.treningsplanlegging.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.treningsplanlegging.treningsplanlegging.dto.GroupChatDto;
import com.treningsplanlegging.treningsplanlegging.entity.Chat;
import com.treningsplanlegging.treningsplanlegging.entity.User;
import com.treningsplanlegging.treningsplanlegging.repository.ChatRepository;


@Service
public class ChatService {
    @Autowired
	private ChatRepository chatRepository;
	@Autowired
	private UserService userService;
	
	public Chat createChat(User reqUser, Long userId2) throws RuntimeException {
		
		User user2 = userService.findById(userId2);
		
		Chat isChatExist = chatRepository.findSingleChatByUsers(user2, reqUser);
		
		if (isChatExist!=null) {
			return isChatExist;
		}
		
		Chat chat = new Chat();
		chat.setCreatedBy(reqUser);
		chat.getUsers().add(user2);
		chat.getUsers().add(reqUser);
		chat.setGroup(false);
		chatRepository.save(chat);
		
		return chat;
		
	}

	public Chat findChatById(Long chatId) throws RuntimeException {
		Optional<Chat> chat = chatRepository.findById(chatId);
		
		if(chat.isPresent()) {
			return chat.get();
		}
		
		throw new RuntimeException("No User found with with id :: " +chatId);
	}

	public List<Chat> findAllChatByUserId(Long userId) throws RuntimeException {
		
		User user = userService.findById(userId);
		
		List<Chat> chats = chatRepository.findChatByUserId(user.getId());
		
		return chats;
	}

	public Chat createGroup(GroupChatDto req, User reqUser) throws RuntimeException {
		
		Chat group = new Chat();
		group.setGroup(true);
		group.setChatImg(req.getChatImage());
		group.setChatName(req.getChatName());
		group.setCreatedBy(reqUser);
		group.getAdmins().add(reqUser);
		// get member 1 by 1 and add it into grp
		for(Long userId:req.getUserIds()) {
			User usersToAddGroup = userService.findById(userId);
			group.getUsers().add(usersToAddGroup);
		}
		
		System.out.println("Senidng data into database final checkout: "+group);
		
		Chat savedChats = chatRepository.save(group);
		
		System.out.println("Data Saved to DB "+savedChats);
		return savedChats;
	}

	public Chat addUserToGroup(Long userId, Long chatId, User reqUser) throws RuntimeException {
		Optional<Chat> group = chatRepository.findById(chatId);
		User user = userService.findById(userId);
		
		
		
		if(group.isPresent()) {
			Chat chat = group.get();
			if (chat.getAdmins().contains(reqUser)) {
				chat.getUsers().add(user);
				return chatRepository.save(chat);
			}
           else {
			throw new RuntimeException("U dont have access to add members in group");
		}
		}
		
         throw new RuntimeException("chat not found with id :: "+chatId);
	}

	public Chat renameGroup(Long chatId, String groupName, User reqUser) throws RuntimeException {
		Optional<Chat> group = chatRepository.findById(chatId);
		if(group.isPresent()) {
			Chat chat = group.get();
			if (chat.getUsers().contains(reqUser)) {
				chat.setChatName(groupName);
				chatRepository.save(chat);
			}
			throw new RuntimeException("you are not member of this group");
		}
		
		throw new RuntimeException("Group not found with Group ID :: "+chatId);
	}
	

	public Chat removeFromGroup(Long chatId, Long userId, User reqUser) throws RuntimeException {
		
		Optional<Chat> group = chatRepository.findById(chatId);
		User user = userService.findById(userId);
		
		
		
		if(group.isPresent()) {
			Chat chat = group.get();
			if (chat.getAdmins().contains(reqUser)) {
				chat.getUsers().remove(user);
				return chatRepository.save(chat);
			}
			else if (chat.getUsers().contains(reqUser)) {
				
				if(user.getId().equals(reqUser.getId())) {
					chat.getUsers().remove(user);
					return chatRepository.save(chat);
				}
			}

			throw new RuntimeException("u Can't remove another user");

		}
		
         throw new RuntimeException("chat not found with id :: "+chatId);
         
	}
	

	public void deleteChat(Long chatId, Long userId) throws RuntimeException {
		 Optional<Chat> chat = chatRepository.findById(chatId);
		 
		 if(chat.isEmpty()) {
			 Chat chatHistory=chat.get();
			 chatRepository.deleteById(chatHistory.getId());
		 }
	}
    
}
