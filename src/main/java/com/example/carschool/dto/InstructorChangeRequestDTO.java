package com.example.carschool.dto;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.CarRequestStatus;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.InstructorChangeRequest;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Getter
@Setter
public class InstructorChangeRequestDTO {


    private Long id;


    private CarRequestStatus status;



    private Long instructorId;
    private String instructorName;
    private String  instructorEmail;


    private Long candidateId;
    private String candidateName;
    private String candidateEmail;


    private String reason;


    public InstructorChangeRequestDTO(InstructorChangeRequest request) {
        this.id = request.getId();
        this.status = request.getStatus();
        this.candidateEmail = request.getCandidate().getEmail();
        this.candidateName = request.getCandidate().getName() + " " + request.getCandidate().getLastname();
        this.candidateId = request.getCandidate().getId();
        this.reason = request.getReason();
        this.instructorId = request.getInstructor().getId();
        this.instructorName = request.getInstructor().getName() + " " + request.getInstructor().getLastname();
        this.instructorEmail = request.getInstructor().getEmail();

    }


}
