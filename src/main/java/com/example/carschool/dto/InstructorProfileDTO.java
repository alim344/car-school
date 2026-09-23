package com.example.carschool.dto;

import com.example.carschool.model.Category;
import com.example.carschool.model.Instructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class InstructorProfileDTO {

    private String name;
    private String email;
    private Category category;
    private String activeVehicleRegistration;
    private Long activeVehicle_id;
    private String primaryVehicleRegistration;
    private Long primaryVehicle_id;
    private List<DocumentDTO> documents;
    public InstructorProfileDTO() {}


    public InstructorProfileDTO(Instructor instructor, List<DocumentDTO> documents) {
        this.name = instructor.getName() + " " + instructor.getLastname();
        this.email = instructor.getEmail();
        this.category = instructor.getCategory();

        if(instructor.getVehicle() != null) {
            this.activeVehicleRegistration = instructor.getVehicle().getRegistrationNumber();
            this.activeVehicle_id = instructor.getVehicle().getId();
        }
        if(instructor.getPrimaryVehicle() != null) {
            this.primaryVehicleRegistration = instructor.getPrimaryVehicle().getRegistrationNumber();
            this.primaryVehicle_id = instructor.getPrimaryVehicle().getId();
        }

        this.documents = documents;

    }
}
