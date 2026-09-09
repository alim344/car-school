package com.example.carschool.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter @Setter
public class Instructor extends User{

    @OneToMany(mappedBy = "instructor", fetch = FetchType.LAZY)
    private List<Candidate> candidates;


    @OneToMany(mappedBy = "instructor")
    private List<InstructorDocuments> documents;

    @Column(nullable = false)
    private Integer maxCapacity;

    @OneToOne
    @JoinColumn(name = "vehicle_id", unique = true) // active vehicle
    private Vehicle vehicle;

    @OneToOne
    @JoinColumn(name = "primary_vehicle_id", unique = true)
    private Vehicle primaryVehicle;

    @Column(nullable = false)
    private Integer annualLeaveAllowance = 30;


}
