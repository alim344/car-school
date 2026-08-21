package com.example.carschool.dto;

import com.example.carschool.model.PracticalClass;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class PracticalClassDTO {
    private Long id;
    private LocalDateTime scheduledStartTime;
    private LocalDateTime scheduledEndTime;
    private String candidateName;
    private String classStatus;
    private Long routeId;
    private String location;

    public PracticalClassDTO(PracticalClass pc) {
        this.id = pc.getId();
        this.scheduledStartTime = pc.getScheduledStartTime();
        this.scheduledEndTime = pc.getScheduledEndTime();
        this.candidateName = pc.getCandidate().getName() + " " + pc.getCandidate().getLastname();
        this.classStatus = pc.getClassStatus().name();
        this.routeId = pc.getRoute() != null ? pc.getRoute().getId() : null;
        this.location = pc.getLocation();
    }
}