package com.example.carschool.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class LocationNote {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "practical_class_id")
    private PracticalClass practicalClass;

    @Column
    private double latitude;

    @Column
    private double longitude;

    @Column(length = 500)
    private String note;

    @Column
    private LocalDateTime createdAt;


    public LocationNote() {}
    public LocationNote(PracticalClass practicalClass, double latitude, double longitude, String note) {
        this.practicalClass = practicalClass;
        this.latitude = latitude;
        this.longitude = longitude;
        this.note = note;
        this.createdAt = LocalDateTime.now();
    }
}
