package com.example.carschool.dto;

import com.example.carschool.model.PracticalClass;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class PracticalClassDTO {
    private Long id;
    private LocalDateTime scheduledStartTime;
    private LocalDateTime scheduledEndTime;
    private String candidateName;
    private String candidateEmail;
    private String classStatus;
    private Long routeId;
    private String location;
    private Integer grade;
    private String comment;
    private String remarks;
    private boolean lastClass;

    public PracticalClassDTO(PracticalClass pc) {
        this.id = pc.getId();
        this.scheduledStartTime = pc.getScheduledStartTime();
        this.scheduledEndTime = pc.getScheduledEndTime();
        this.candidateName = pc.getCandidate().getName() + " " + pc.getCandidate().getLastname();
        this.candidateEmail = pc.getCandidate().getEmail();
        this.classStatus = pc.getClassStatus().name();
        this.routeId = pc.getRoute() != null ? pc.getRoute().getId() : null;
        this.location = pc.getLocation();
        this.grade = pc.getGrade();
        this.comment = pc.getComment();
        this.remarks = pc.getRemarks();
    }
}