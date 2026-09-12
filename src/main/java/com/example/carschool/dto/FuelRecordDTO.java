package com.example.carschool.dto;


import com.example.carschool.model.FuelRecord;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class FuelRecordDTO {



    private Long id;

    private LocalDate refuelDate;

    private Double liters;

    private Double totalCost;

    private Integer mileageAtRefuel;

    private Long vehicleId;
    private Long instructorId;


    public FuelRecordDTO() {
    }


    public FuelRecordDTO(FuelRecord fuelRecord) {
        this.id = fuelRecord.getId();
        this.refuelDate = fuelRecord.getRefuelDate();
        this.liters = fuelRecord.getLiters();
        this.totalCost = fuelRecord.getTotalCost();
        this.mileageAtRefuel = fuelRecord.getMileageAtRefuel();
        this.vehicleId = fuelRecord.getVehicle().getId();
        this.instructorId = fuelRecord.getInstructor().getId();
    }

}
