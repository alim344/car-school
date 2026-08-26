package com.example.carschool.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateClassDTO {

    private String candidateEmail;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;

    public CreateClassDTO() {
    }
}
