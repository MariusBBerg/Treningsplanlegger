package com.treningsplanlegging.treningsplanlegging.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupChatDto {

	private List<Long> userIds;
	private String chatName;
	private String chatImage;
}
