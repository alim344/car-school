package com.example.carschool.service;

import com.example.carschool.repo.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InstructorService {

    @Autowired
    private  InstructorRepository instructorRepository;
}
