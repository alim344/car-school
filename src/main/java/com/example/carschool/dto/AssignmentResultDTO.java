package com.example.carschool.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class AssignmentResultDTO {

    private String candidateEmail;
    private String candidateName;
    private String instructorEmail;
    private String instructorName;


    public AssignmentResultDTO(String candidateEmail, String candidateName,String instructorEmail, String instructorName) {
        this.candidateEmail = candidateEmail;
        this.candidateName = candidateName;
        this.instructorEmail = instructorEmail;
        this.instructorName = instructorName;
    }




}
