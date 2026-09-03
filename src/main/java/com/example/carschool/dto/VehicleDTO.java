package com.example.carschool.dto;

import com.example.carschool.model.Vehicle;
import com.example.carschool.model.VehicleBrand;
import com.example.carschool.model.VehicleStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class VehicleDTO {


    private Long id;
    private LocalDate registrationExpiryDate;
    private String registrationNumber;
    private VehicleStatus status;
    private Integer currentMileage;
    private String instructor_email;
    private String instructor_name;

    private String brand;
    private String model;
    private String colour;
    private String year;

    public VehicleDTO() {}


    public VehicleDTO(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.registrationExpiryDate = vehicle.getRegistrationExpiryDate();
        this.registrationNumber = vehicle.getRegistrationNumber();
        this.status = vehicle.getStatus();
        this.currentMileage = vehicle.getCurrentMileage();
        if(vehicle.getInstructor() != null) {
            this.instructor_email = vehicle.getInstructor().getEmail();
            this.instructor_name = vehicle.getInstructor().getName()+ " " + vehicle.getInstructor().getLastname();
        }
        VehicleBrand vehicle_brand = vehicle.getBrand();
        if(vehicle_brand != null) {
            this.brand = vehicle_brand.getBrand();
            this.model = vehicle_brand.getModel();
            this.colour = vehicle_brand.getColour();
            this.year = vehicle_brand.getYear();

        }

    }

}
