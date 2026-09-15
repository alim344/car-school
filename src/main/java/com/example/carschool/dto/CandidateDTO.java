package com.example.carschool.dto;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.TrainingStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String category;
    private Integer numberOfClassesLeft;
    private TrainingStatus trainingStatus;

    private String instructor_name;
    private String instructor_email;

    public CandidateDTO() {

    }

    public CandidateDTO(Candidate candidate) {
        this.id = candidate.getId();
        this.category = candidate.getCategory().toString();
        this.firstName = candidate.getName();
        this.lastName = candidate.getLastname();
        this.email = candidate.getEmail();
        this.trainingStatus = candidate.getStatus();
        this.numberOfClassesLeft = candidate.getTotalRequiredClasses() - candidate.getNumberOfCompletedClasses();
        if(candidate.getInstructor() != null) {
            this.instructor_name = candidate.getInstructor().getName() + " " + candidate.getInstructor().getLastname();
            this.instructor_email = candidate.getInstructor().getEmail();
        }
    }


}
