package com.example.carschool.service;

import com.example.carschool.dto.RegistrationDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.User;
import com.example.carschool.repo.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

@Service
public class AuthenticationService {


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleService roleService;
    @Autowired
    private CandidateRepository candidateRepository;


    public User register(RegistrationDTO registrationDTO) {


        Candidate c = new Candidate();

        c.setName(registrationDTO.getFirstName());
        c.setLastname(registrationDTO.getLastName());
        c.setEmail(registrationDTO.getEmail());
        c.setStartOfTraining(LocalDateTime.now());
        c.setUsername(registrationDTO.getUsername());
        c.setCategory(registrationDTO.getCategory());
        c.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        c.setRole(roleService.findByRole("ROLE_CANDIDATE"));
        return candidateRepository.save(c);


    }


}
