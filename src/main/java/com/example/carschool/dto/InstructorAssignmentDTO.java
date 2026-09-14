package com.example.carschool.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
public class InstructorAssignmentDTO {


    private Long inst_id;
    private String instructor_email;

    private List<String> candidate_emails;




}
