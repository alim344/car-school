package com.example.carschool.dto;

import com.example.carschool.model.Instructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class InstructorDTO {

    private String name;
    private String email;
    private Long id;

    public InstructorDTO() {}

    public InstructorDTO(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public InstructorDTO(Instructor instructor) {
        this.id = instructor.getId();
        this.name = instructor.getName() + " " + instructor.getLastname();
        this.email = instructor.getEmail();
    }

}
