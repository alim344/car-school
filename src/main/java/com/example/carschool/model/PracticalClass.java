package com.example.carschool.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class PracticalClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime scheduledStartTime;

    @Column(nullable = false)
    private LocalDateTime scheduledEndTime;

    @Column
    private LocalDateTime actualStartTime;

    @Column
    private LocalDateTime actualEndTime;

    @ManyToOne
    @JoinColumn(name = "instructor_id",nullable = false)
    private Instructor instructor;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ClassStatus classStatus;

    @ManyToOne
    @JoinColumn(name = "route_id",nullable = true)
    private Route route;

    @Column
    private Integer grade;

    @Column(length = 600)
    private String comment;

    @Column(length = 600)
    private String remarks;

    @Enumerated(EnumType.STRING)
    private InterruptionReason interruptionReason;

    @Column(length = 500)
    private String interruptionNote;

    @Column
    private String location;

}
