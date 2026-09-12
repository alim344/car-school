package com.example.carschool.dto;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.TrainingStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class CandidateProfileDTO {


    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String category;
    private Integer numberOfClassesLeft;
    private Integer numberOfCompletedClasses;
    private Integer totalNumberOfClasses;
    private TrainingStatus trainingStatus;
    List<PracticalClassDTO> classes;


    public CandidateProfileDTO() {}

    public CandidateProfileDTO(Candidate candidate, List<PracticalClassDTO> classes) {
        this.id = candidate.getId();
        this.firstName = candidate.getName();
        this.lastName = candidate.getLastname();
        this.email = candidate.getEmail();
        this.category = candidate.getCategory().toString();
        this.numberOfCompletedClasses = candidate.getNumberOfCompletedClasses();
        this.totalNumberOfClasses = candidate.getTotalRequiredClasses();
        this.numberOfClassesLeft = candidate.getTotalRequiredClasses() - candidate.getNumberOfCompletedClasses();
        this.trainingStatus = candidate.getStatus();
        this.classes = classes;
    }

}
