package com.example.carschool.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class Vehicle {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable=false, unique = true)
    private String registrationNumber;

    @Column(nullable=false)
    private LocalDate registrationExpiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;

    @Column(nullable = false)
    private Integer currentMileage;

    @OneToOne(mappedBy = "vehicle")
    private Instructor instructor;

    @OneToOne(mappedBy = "primaryVehicle")
    private Instructor primaryInstructor;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private VehicleBrand brand;


}
