package com.example.carschool.dto;

import com.example.carschool.model.ExamStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class CreateExamDTO {


    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime dateTime;
    @JsonProperty("candidate_email")
    private String candidateEmail;

    @JsonProperty("admin_email")
    private String adminEmail;

    public CreateExamDTO() {}

}
