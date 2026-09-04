package com.example.carschool.dto;

import com.example.carschool.model.VehicleBrand;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BrandDTO {

    public BrandDTO() {}

    private String brand;
    private String model;
    private String colour;
    private String year;
    private Long brand_id;

    public BrandDTO(VehicleBrand brand) {
        this.brand = brand.getBrand();
        this.model = brand.getModel();
        this.colour = brand.getColour();
        this.year = brand.getYear();
        this.brand_id = brand.getId();

    }
}
