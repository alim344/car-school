package com.example.carschool.controller;


import com.example.carschool.dto.RegistrationDTO;
import com.example.carschool.dto.SignInDTO;
import com.example.carschool.dto.SignInResponseDTO;
import com.example.carschool.model.User;
import com.example.carschool.service.*;
import com.example.carschool.util.TokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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


    @PostMapping("/login")
    public ResponseEntity<SignInResponseDTO> signin(@RequestBody SignInDTO dto){

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = (User) authentication.getPrincipal();
        String jwt = tokenUtils.generateToken(user.getEmail());
        long expiresIn  = tokenUtils.getExpiredIn();
        String role = user.getRole().getRole();

        return ResponseEntity.ok(new SignInResponseDTO(jwt, expiresIn, role));

    }


    @PostMapping("/register/instructor")
    public ResponseEntity<?> registerInstructor(@RequestBody RegistrationDTO registrationDTO) {

        User existUser = userService.findByEmail(registrationDTO.getEmail());
        if (existUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("field", "email", "message", "Email is already in use"));
        }

        existUser = userService.findByUsername(registrationDTO.getUsername());
        if (existUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("field", "username", "message", "Username is already in use"));
        }


        User savedUser = authenticationService.registerInstructor(registrationDTO);
        return ResponseEntity.status(HttpStatus.OK).body(savedUser);

    }


    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody RegistrationDTO registrationDTO) {

        User existUser = userService.findByEmail(registrationDTO.getEmail());
        if (existUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("field", "email", "message", "Email is already in use"));
        }

        existUser = userService.findByUsername(registrationDTO.getUsername());
        if (existUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("field", "username", "message", "Username is already in use"));
        }


        User savedUser = authenticationService.registerAdmin(registrationDTO);
        return ResponseEntity.status(HttpStatus.OK).body(savedUser);

    }
}
