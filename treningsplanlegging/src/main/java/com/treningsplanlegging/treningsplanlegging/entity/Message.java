package com.treningsplanlegging.treningsplanlegging.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Message {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String content;
	
	private LocalDateTime timestamp;
	
	@ManyToOne      // user can create multiple messages. thats why many to one
	private User user;
	
	@ManyToOne
	//@JoinColumn(name="chat_id")
	private Chat chat;
	
}
