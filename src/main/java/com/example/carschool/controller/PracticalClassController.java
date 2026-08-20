package com.example.carschool.controller;

import com.example.carschool.service.PracticalClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/practical-class")
public class PracticalClassController {


    @Autowired
    private PracticalClassService practicalClassService;
}
