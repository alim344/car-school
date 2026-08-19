package com.example.carschool.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignInResponseDTO {


    private String token;


    private Long expiresIn;


    private String role;


    public SignInResponseDTO() {
        this.token = null;
        this.expiresIn = null;
        this.role = null;
    }

    public SignInResponseDTO(String token, long expiresIn, String role) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.role = role;
    }

}
