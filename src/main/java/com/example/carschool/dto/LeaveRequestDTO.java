package com.example.carschool.dto;

import com.example.carschool.model.Instructor;
import com.example.carschool.model.InstructorLeaveRequest;
import com.example.carschool.model.LeaveStatus;
import com.example.carschool.model.LeaveType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
public class LeaveRequestDTO {

    private Long id;


    private String instructorName;
    private String instructorEmail;

    private LocalDate startDate;

    private LocalDate endDate;

    private LeaveType type;

    private LeaveStatus status;

    private String reason;

    private String adminComment;

    private LocalDateTime requestedAt;
    private LocalDateTime resolvedAt;


    public LeaveRequestDTO(InstructorLeaveRequest request) {
        this.id = request.getId();
        this.instructorName = request.getInstructor().getName() + " " + request.getInstructor().getLastname();
        this.instructorEmail = request.getInstructor().getEmail();
        this.startDate = request.getStartDate();
        this.endDate = request.getEndDate();
        this.adminComment = request.getAdminComment();
        this.reason = request.getReason();
        this.requestedAt = request.getRequestedAt();
        this.resolvedAt = request.getResolvedAt();
        this.status = request.getStatus();
        this.type = request.getType();

    }

}
