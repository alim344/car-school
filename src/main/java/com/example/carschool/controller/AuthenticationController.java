package com.example.carschool.controller;


import com.example.carschool.dto.RegistrationDTO;
import com.example.carschool.model.User;
import com.example.carschool.service.*;
import com.example.carschool.util.TokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {



    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService authenticationService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationDTO registrationDTO) {

        User existUser = userService.findByEmail(registrationDTO.getEmail());
        if (existUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("field", "email", "message", "Email is already in use"));
        }

        existUser = userService.findByUsername(registrationDTO.getUsername());
        if (existUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("field", "username", "message", "Username is already in use"));
        }


        User savedUser = authenticationService.register(registrationDTO);
        return ResponseEntity.status(HttpStatus.OK).body(savedUser);

    }



}
