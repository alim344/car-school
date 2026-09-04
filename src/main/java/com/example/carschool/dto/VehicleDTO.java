package com.example.carschool.dto;

import com.example.carschool.model.Instructor;
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

    private Long brand_id;
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
        Instructor relevantInstructor = vehicle.getInstructor() != null
                ? vehicle.getInstructor()
                : vehicle.getPrimaryInstructor();

        if (relevantInstructor != null) {
            this.instructor_email = relevantInstructor.getEmail();
            this.instructor_name = relevantInstructor.getName() + " " + relevantInstructor.getLastname();
        }
        VehicleBrand vehicle_brand = vehicle.getBrand();
        if(vehicle_brand != null) {
            this.brand_id = vehicle_brand.getId();
            this.brand = vehicle_brand.getBrand();
            this.model = vehicle_brand.getModel();
            this.colour = vehicle_brand.getColour();
            this.year = vehicle_brand.getYear();

        }

    }


    public static BrandDTO getBrandFromVehicle(VehicleDTO vehicleDTO) {
        BrandDTO brandDTO = new BrandDTO();
        brandDTO.setBrand(vehicleDTO.getBrand());
        brandDTO.setModel(vehicleDTO.getModel());
        brandDTO.setColour(vehicleDTO.getColour());
        brandDTO.setYear(vehicleDTO.getYear());
        return brandDTO;
    }

}
