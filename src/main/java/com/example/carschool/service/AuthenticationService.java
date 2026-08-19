package com.example.carschool.service;

import com.example.carschool.dto.RegistrationDTO;
import com.example.carschool.model.Admin;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.User;
import com.example.carschool.repo.AdminRepository;
import com.example.carschool.repo.CandidateRepository;
import com.example.carschool.repo.InstructorRepository;
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

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private AdminRepository adminRepository;


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

    public User registerInstructor(RegistrationDTO registrationDTO) {
        Instructor i = new Instructor();
        i.setName(registrationDTO.getFirstName());
        i.setLastname(registrationDTO.getLastName());
        i.setEmail(registrationDTO.getEmail());
        i.setUsername(registrationDTO.getUsername());
        i.setMaxCapacity(7);
        i.setLastPasswordResetDate(Timestamp.valueOf(LocalDateTime.now()));
        i.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        i.setRole(roleService.findByRole("ROLE_INSTRUCTOR"));
        return instructorRepository.save(i);
    }

    public User registerAdmin(RegistrationDTO registrationDTO) {
        Admin a = new Admin();
        a.setUsername(registrationDTO.getUsername());
        a.setEmail(registrationDTO.getEmail());
        a.setLastname(registrationDTO.getLastName());
        a.setName(registrationDTO.getFirstName());
        a.setRole(roleService.findByRole("ROLE_ADMIN"));
        a.setLastPasswordResetDate(Timestamp.valueOf(LocalDateTime.now()));
        a.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        return adminRepository.save(a);
    }

}
