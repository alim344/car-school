package com.example.carschool.controller;

import com.example.carschool.dto.InstructorDashboardDTO;
import com.example.carschool.service.InstructorService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


}
