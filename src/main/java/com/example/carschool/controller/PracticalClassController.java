package com.example.carschool.controller;

import com.example.carschool.dto.EndClassDTO;
import com.example.carschool.dto.PracticalClassDTO;
import com.example.carschool.dto.SetRouteDTO;
import com.example.carschool.service.PracticalClassService;
import com.example.carschool.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @PatchMapping("/setRoute")
    public ResponseEntity<?> setRoute(@RequestBody SetRouteDTO dto){
        return ResponseEntity.ok(practicalClassService.setRoute(dto.getClassId(),dto.getRouteId()));
    }

    @PatchMapping("/endClass")
    public ResponseEntity<PracticalClassDTO> endClass(@RequestBody EndClassDTO dto){
        return ResponseEntity.ok(practicalClassService.endClass(dto));
    }


}
