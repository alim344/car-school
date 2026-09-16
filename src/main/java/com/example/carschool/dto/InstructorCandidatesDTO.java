package com.example.carschool.dto;

import com.example.carschool.model.Instructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class InstructorCandidatesDTO {


    private String instructorName;
    private String instructorEmail;
    private boolean active;

    List<CandidateDTO> candidates;

    public InstructorCandidatesDTO() {}

    public InstructorCandidatesDTO(Instructor instructor, List<CandidateDTO> candidates) {
        this.instructorName = instructor.getName() + " " + instructor.getLastname();
        this.instructorEmail = instructor.getEmail();
        this.candidates = candidates;
        this.active = instructor.isActive();

    }


}
