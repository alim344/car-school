package com.example.carschool.controller;

import com.example.carschool.dto.InstructorDTO;
import com.example.carschool.dto.InstructorDashboardDTO;
import com.example.carschool.dto.InstructorProfileDTO;
import com.example.carschool.service.InstructorService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/instructor")
public class InstructorController {


    private final InstructorService instructorService;
    private final TokenUtils tokenUtils;

    public InstructorController(InstructorService instructorService, TokenUtils tokenUtils) {
        this.instructorService = instructorService;
        this.tokenUtils = tokenUtils;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<InstructorDashboardDTO> getDashboard(HttpServletRequest request){

        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        return ResponseEntity.ok(instructorService.getDashboardInfo(email));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<InstructorDTO>> getAll(){
        return ResponseEntity.ok(instructorService.getALl());
    }


    @GetMapping("/profile")
    public ResponseEntity<InstructorProfileDTO>  getProfile(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        return ResponseEntity.ok(instructorService.getInstructorProfile(email));
    }

    @PatchMapping("/date/{id}")
    public ResponseEntity<?> changeDocumentsDate(@PathVariable Long id, @RequestParam LocalDate date){
        instructorService.changeDateOfDocument(id, date);
        return ResponseEntity.ok().build();
    }





}
