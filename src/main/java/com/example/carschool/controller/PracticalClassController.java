package com.example.carschool.controller;

import com.example.carschool.service.PracticalClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/practical-class")
public class PracticalClassController {


    @Autowired
    private PracticalClassService practicalClassService;

    @PatchMapping("/start/{classId}")
    public ResponseEntity<?> startPracticalClass(@PathVariable Long classId) {
        practicalClassService.startClass(classId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/cancel/{classId}")
    public ResponseEntity<?> cancelClass(@PathVariable Long classId){
        practicalClassService.cancelClass(classId);
        return ResponseEntity.ok().build();
    }



}
