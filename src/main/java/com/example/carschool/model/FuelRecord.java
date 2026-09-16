package com.example.carschool.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class FuelRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate refuelDate;

    @Column(nullable = false)
    private Double liters;

    @Column(nullable = false)
    private Double totalCost;

    @Column(nullable = false)
    private Integer mileageAtRefuel;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructor instructor;

    public FuelRecord() {
    }

    public FuelRecord(LocalDate date, Double liters,Double totalCost, Integer mileage, Vehicle vehicle, Instructor instructor ){
        this.refuelDate = date;
        this.liters = liters;
        this.totalCost = totalCost;
        this.mileageAtRefuel = mileage;
        this.vehicle = vehicle;
        this.instructor = instructor;

    }

}
