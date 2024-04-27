package com.treningsplanlegging.treningsplanlegging.dto;
import com.fasterxml.jackson.annotation.JsonFormat;


import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkoutDto {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Long id;
    private Date date;
    private String name;
    private String description;
    private Double distance; // Valgfritt, for Running
    private Long durationSeconds; // Varighet i sekunder, valgfritt, for Running
    private String type;
    private Integer intensityZone;
    private String userLogin;

    
}
