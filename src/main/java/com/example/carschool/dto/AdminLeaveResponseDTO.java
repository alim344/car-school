package com.example.carschool.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminLeaveResponseDTO {

    private String response;
    private boolean accepted;
    private Long id;


    public AdminLeaveResponseDTO(){}
}
