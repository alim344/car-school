package com.example.carschool.dto;

import com.example.carschool.model.CarChangeRequest;
import com.example.carschool.model.CarRequestStatus;
import com.example.carschool.model.VehicleStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class CarRequestDTO {

    private Long id;

    private  String instructor_name;
    private String instructor_email;

    private Long vehicle_id;
    private VehicleStatus vehicle_status;
    private String registrationNumber;

    private CarRequestStatus status;
    private LocalDateTime request_date;
    private boolean pickedUp;


    public CarRequestDTO(){}

    public CarRequestDTO(CarChangeRequest request) {
        this.id = request.getId();
        this.instructor_email = request.getInstructor().getEmail();
        this.instructor_name = request.getInstructor().getName() + " " + request.getInstructor().getLastname();
        this.vehicle_id = request.getVehicle().getId();
        this.vehicle_status = request.getVehicle().getStatus();
        this.registrationNumber = request.getVehicle().getRegistrationNumber();
        this.status = request.getStatus();
        this.request_date = request.getRequestDate();
        this.pickedUp = request.isPickedUp();
    }

}
