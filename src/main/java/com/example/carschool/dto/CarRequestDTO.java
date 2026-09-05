package com.example.carschool.dto;

import com.example.carschool.model.CarChangeRequest;
import com.example.carschool.model.VehicleStatus;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CarRequestDTO {

    public String instructor_name;
    public String instructor_email;

    public Long vehicle_id;
    public VehicleStatus vehicle_status;


    public CarRequestDTO(){}

    public CarRequestDTO(CarChangeRequest request) {
        this.instructor_email = request.getInstructor().getEmail();
        this.instructor_name = request.getInstructor().getName() + " " + request.getInstructor().getLastname();
        this.vehicle_id = request.getVehicle().getId();
        this.vehicle_status = request.getVehicle().getStatus();
    }

}
