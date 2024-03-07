package com.treningsplanlegging.treningsplanlegging.dto;
import com.fasterxml.jackson.annotation.JsonFormat;


import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkoutDto {
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date;
    private String description;
    
}
