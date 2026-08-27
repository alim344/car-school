package com.example.carschool.dto;

import com.example.carschool.model.Candidate;
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

    public CandidateDTO() {

    }

    public CandidateDTO(Candidate candidate) {
        this.id = candidate.getId();
        this.category = candidate.getCategory().toString();
        this.firstName = candidate.getName();
        this.lastName = candidate.getLastname();
        this.email = candidate.getEmail();
    }


}
