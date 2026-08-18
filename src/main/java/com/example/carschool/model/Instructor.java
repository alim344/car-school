package com.example.carschool.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
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
}
