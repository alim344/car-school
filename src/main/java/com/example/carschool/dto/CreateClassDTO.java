package com.example.carschool.dto;

import com.example.carschool.model.PracticalClass;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateClassDTO {

    private String candidateEmail;
    private String candidateName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;

    public CreateClassDTO() {
    }


    public CreateClassDTO(PracticalClass pc){
        this.candidateEmail= pc.getCandidate().getEmail();
        this.startTime = pc.getScheduledStartTime();
        this.endTime = pc.getScheduledEndTime();
        this.location = pc.getLocation();
        this.candidateName = pc.getCandidate().getName() + " " + pc.getCandidate().getLastname();
    }




}
