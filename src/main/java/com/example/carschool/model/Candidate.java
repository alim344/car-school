package com.example.carschool.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Candidate extends User{


    @Column
    private LocalDateTime startOfTraining;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Category category;

    @Column
    @Enumerated(EnumType.STRING)
    private TrainingStatus status = TrainingStatus.THEORY;

    @Column
    private boolean theoryCompleted = false;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private Instructor instructor;




}
