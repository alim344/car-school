package com.example.carschool.dto;

import com.example.carschool.model.Instructor;
import com.example.carschool.model.Vehicle;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class VehicleInstructorDTO {

    private String name;
    private String email;
    private boolean needsReserve;
    public VehicleInstructorDTO() {}

    public VehicleInstructorDTO(Instructor instructor) {
        this.name = instructor.getName();
        this.email = instructor.getEmail();

        Vehicle primary = instructor.getPrimaryVehicle();
        this.needsReserve = primary != null;
    }

}
