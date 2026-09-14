package com.example.carschool.dto;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.Category;
import com.example.carschool.model.Instructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UsersDTO {


    private String name;
    private String email;
    private Long id;
    private Integer availableSpots;
    private Category category;


    public UsersDTO() {}

    public UsersDTO(Candidate candidate){
        this.name = candidate.getName() + " " + candidate.getLastname();
        this.email = candidate.getEmail();
        this.id = candidate.getId();
        this.category = candidate.getCategory();
    }

    public UsersDTO(Instructor instructor, Integer availableSpots){
        this.name = instructor.getName() + " " + instructor.getLastname();
        this.email = instructor.getEmail();
        this.id = instructor.getId();
        this.category = instructor.getCategory();
        this.availableSpots = availableSpots;
    }



}
