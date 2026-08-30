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

    @Column(nullable = false)
    private Integer numberOfCompletedClasses = 0;

    @Column(nullable = false)
    private Integer totalRequiredClasses = 40;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private Instructor instructor;

    @Column
    private String location;


}
