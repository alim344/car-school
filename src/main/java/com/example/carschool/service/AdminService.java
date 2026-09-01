package com.example.carschool.service;

import com.example.carschool.dto.InstructorDTO;
import com.example.carschool.dto.TimeDTO;
import com.example.carschool.model.Admin;
import com.example.carschool.model.ExamStatus;
import com.example.carschool.repo.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;


    public Admin findByEmail(String email){
        return adminRepository.findByEmail(email);
    }

    public List<InstructorDTO> getAvailableAdmins(TimeDTO time){
        List<InstructorDTO> dtos = new ArrayList<>();
        List<Admin> admins = adminRepository.findAvailableAdminsAt(time.getStartTime(), ExamStatus.CANCELLED);
        for(Admin admin : admins){
            InstructorDTO instructorDTO = new InstructorDTO();
            instructorDTO.setEmail(admin.getEmail());
            instructorDTO.setName(admin.getName() + " " + admin.getLastname());
            dtos.add(instructorDTO);
        }
        return dtos;
    }




}
