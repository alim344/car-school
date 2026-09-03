package com.example.carschool.dto;

import com.example.carschool.model.Vehicle;
import com.example.carschool.model.VehicleStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class VehicleDTO {


    private Long id;
    private LocalDate registrationExpiryDate;
    private VehicleStatus status;
    private Integer currentMileage;
    private String instructor_email;
    private String instructor_name;

    public VehicleDTO() {}


    public VehicleDTO(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.registrationExpiryDate = vehicle.getRegistrationExpiryDate();
        this.status = vehicle.getStatus();
        this.currentMileage = vehicle.getCurrentMileage();
        this.instructor_email = vehicle.getInstructor().getEmail();
        this.instructor_name = vehicle.getInstructor().getName() + " " + vehicle.getInstructor().getLastname();
    }

}
