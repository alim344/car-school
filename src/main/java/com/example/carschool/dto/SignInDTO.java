package com.example.carschool.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignInDTO {

    private String email;
    private String password;

    public SignInDTO() {}


    public SignInDTO(String email, String password) {
        this.setEmail(email);
        this.setPassword(password);
    }
}
