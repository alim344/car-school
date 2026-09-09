package com.example.carschool.controller;

import com.example.carschool.dto.EndClassDTO;
import com.example.carschool.dto.InterruptionClassDTO;
import com.example.carschool.dto.PracticalClassDTO;
import com.example.carschool.dto.SetRouteDTO;
import com.example.carschool.model.Instructor;
import com.example.carschool.service.InstructorService;
import com.example.carschool.service.PracticalClassService;
import com.example.carschool.service.RouteService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/practical-class")
public class PracticalClassController {


    @Autowired
    private PracticalClassService practicalClassService;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private InstructorService instructorService;


    @PatchMapping("/start/{classId}")
    public ResponseEntity<?> startPracticalClass(@PathVariable Long classId, HttpServletRequest request) {

        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);

        Instructor instructor = instructorService.findByEmail(email);

        practicalClassService.startClass(classId,instructor);
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

    @PatchMapping("/interrupt")
    public ResponseEntity<?> interruptClass(@RequestBody InterruptionClassDTO dto){
        return ResponseEntity.ok(practicalClassService.interruptClass(dto));
    }


    @PatchMapping("/cancelToday")
    public ResponseEntity<List<PracticalClassDTO>> cancelTodayClasses(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(practicalClassService.cancelByDay(instructor));
    }



}
