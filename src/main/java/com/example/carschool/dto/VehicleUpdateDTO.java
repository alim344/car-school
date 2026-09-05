package com.example.carschool.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
public class VehicleUpdateDTO {

     private Long id;
     private Integer mileage;
     private LocalDate registrationExpiryDate;

     public VehicleUpdateDTO(){}



}
