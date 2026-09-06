package com.example.carschool.dto;

import com.example.carschool.model.VehicleMalfunctionRecord;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class MalfunctionDTO {

    private Long id;
    private LocalDate malfunctionDate;


    private LocalDate fixedDate;

    private boolean isFixed;


    public MalfunctionDTO() {}
    public MalfunctionDTO(VehicleMalfunctionRecord record) {
        this.fixedDate = record.getFixedDate();
        this.isFixed = record.isFixed();
        this.malfunctionDate = record.getMalfunctionDate();
        this.id = record.getId();
    }

}
