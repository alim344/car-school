package com.example.carschool.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"candidate_id", "weekStartDate"}))
@Getter @Setter
public class Preference {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDate weekStartDate;

    @Column
    private Double pickupLatitude;

    @Column
    private Double pickupLongitude;

    @Column
    private String locationName;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;


    @OneToMany(mappedBy = "preference", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimePreference> timePreferences = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private PreferenceStatus status;

}
