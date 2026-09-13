package com.example.carschool.controller;

import com.example.carschool.dto.CandidateDTO;
import com.example.carschool.model.Instructor;
import com.example.carschool.service.CandidateService;
import com.example.carschool.service.InstructorService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/candidate")
public class CandidateController {


    @Autowired
    private CandidateService candidateService;
    @Autowired
    private  InstructorService instructorService;
    @Autowired
    private  TokenUtils tokenUtils;

    @GetMapping("/instructor-get")
    public ResponseEntity<List<CandidateDTO>> getInstructorCandidateNames(HttpServletRequest request) {

        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);

        return ResponseEntity.ok(candidateService.getNameByInstructor(instructor));
    }


    @GetMapping("/pending")
    public ResponseEntity<List<CandidateDTO>> getPendingCandidates() {

        return ResponseEntity.ok(candidateService.getPendingCandidates());

    }

    @GetMapping("/inst-getAll")
    public ResponseEntity<List<CandidateDTO>> getAll(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(candidateService.getAllDtoByInstructor(instructor));
    }




}
