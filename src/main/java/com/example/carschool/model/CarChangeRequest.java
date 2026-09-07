package com.example.carschool.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class CarChangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;


    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private Instructor instructor;

    @Column
    @Enumerated(EnumType.STRING)
    private CarRequestStatus status;

    @Column
    private LocalDateTime requestDate;


}
