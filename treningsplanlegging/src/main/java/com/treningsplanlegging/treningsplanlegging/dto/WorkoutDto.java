package com.treningsplanlegging.treningsplanlegging.dto;
import com.fasterxml.jackson.annotation.JsonFormat;


import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkoutDto {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date date;
    private String description;
    private Double distance; // Valgfritt, for løping
    private Long durationSeconds; // Varighet i sekunder, valgfritt, for løping
    private String type;
    private Integer intensityZone;

    
}
