package com.example.carschool.dto;

import com.example.carschool.model.ExamStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class CreateExamDTO {



    private LocalDateTime dateTime;

    private String candidate_email;

    private String admin_email;

    public CreateExamDTO() {}

}
