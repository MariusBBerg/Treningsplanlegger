package com.treningsplanlegging.treningsplanlegging.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageDto {

	private Long chatId;
	private String content;
	private Long userId;
}