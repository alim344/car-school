package com.example.carschool.model;

import com.example.carschool.service.InstructorService;
import com.example.carschool.service.PracticalClassService;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class ClassRequest {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;


    @Column(nullable = false)
    private LocalDate date;

    @Column
    private LocalTime startTime;
    @Column
    private LocalTime endTime;

    @Column
    private String location;

    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructor instructor;


}
