package com.example.carschool.dto;

import com.example.carschool.model.CarChangeRequest;
import com.example.carschool.model.VehicleStatus;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CarRequestDTO {

    private Long id;

    private  String instructor_name;
    private String instructor_email;

    private Long vehicle_id;
    private VehicleStatus vehicle_status;


    public CarRequestDTO(){}

    public CarRequestDTO(CarChangeRequest request) {
        this.id = request.getId();
        this.instructor_email = request.getInstructor().getEmail();
        this.instructor_name = request.getInstructor().getName() + " " + request.getInstructor().getLastname();
        this.vehicle_id = request.getVehicle().getId();
        this.vehicle_status = request.getVehicle().getStatus();
    }

}
