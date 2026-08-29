package com.example.carschool.dto;

import com.example.carschool.model.ClassRequest;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ClassRequestDTO {

    private String candidate_name;

    private String candidate_email;

    private Long id;

    private LocalDate date;

    private LocalTime startTime;
    private LocalTime endTime;

    private String location;

    public ClassRequestDTO(ClassRequest classRequest) {
        this.id = classRequest.getId();
        this.date = classRequest.getDate();
        this.startTime = classRequest.getStartTime();
        this.endTime = classRequest.getEndTime();
        this.location = classRequest.getLocation();
        this.candidate_email = classRequest.getCandidate().getEmail();
        this.candidate_name = classRequest.getCandidate().getName() + " " + classRequest.getCandidate().getLastname();
    }

    public ClassRequestDTO() {}


}
