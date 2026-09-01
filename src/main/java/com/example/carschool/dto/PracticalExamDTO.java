package com.example.carschool.dto;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.ExamStatus;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.PracticalExam;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class PracticalExamDTO {

    private LocalDateTime dateTime;

    private Long id;
    private ExamStatus status;


    private String candidate_email;
    private String candidate_name;





    private String admin_email;
    private String admin_name;

    private Integer score;


    public PracticalExamDTO(PracticalExam practicalExam) {
        this.id = practicalExam.getId();
        this.score = practicalExam.getScore();
        this.dateTime = practicalExam.getDateTime();
        this.status = practicalExam.getStatus();
        this.candidate_email = practicalExam.getCandidate().getEmail();
        this.admin_email = practicalExam.getAdmin().getEmail();
        this.admin_name = practicalExam.getAdmin().getName() + " " + practicalExam.getAdmin().getLastname();
        this.candidate_name = practicalExam.getCandidate().getName()+ " " + practicalExam.getCandidate().getLastname();

    }
    public PracticalExamDTO() {}

}
