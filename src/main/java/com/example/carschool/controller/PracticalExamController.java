package com.example.carschool.controller;

import com.example.carschool.dto.CreateExamDTO;
import com.example.carschool.dto.PracticalExamDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.service.CandidateService;
import com.example.carschool.service.InstructorService;
import com.example.carschool.service.PracticalExamService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/p-exam")
public class PracticalExamController {

    @Autowired
    private PracticalExamService practicalExamService;

    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private InstructorService instructorService;
    @Autowired
    private CandidateService candidateService;

    @GetMapping("/admin/getAll")
    public ResponseEntity<List<PracticalExamDTO>> getAllPracticalExams() {
        return ResponseEntity.ok(practicalExamService.getAll());
    }

    @GetMapping("/inst/get")
    public ResponseEntity<List<PracticalExamDTO>> getByInstructor(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(practicalExamService.getByInstructor(instructor));
    }


    @GetMapping("/cand/get")
    public ResponseEntity<List<PracticalExamDTO>> getByCandidate(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);
        return ResponseEntity.ok(practicalExamService.getByCandidate(candidate));
    }


    @PostMapping("/admin/schedule")
    public ResponseEntity<PracticalExamDTO> scheduleExam(CreateExamDTO dto){
        return ResponseEntity.ok(practicalExamService.createExam(dto));
    }


    @PatchMapping("/admin/cancel")
    public ResponseEntity<PracticalExamDTO> cancelExam(PracticalExamDTO dto){
        return ResponseEntity.ok(practicalExamService.cancelExam(dto));
    }

    @PatchMapping("/inst/pass")
    public ResponseEntity<PracticalExamDTO> passExam(PracticalExamDTO dto){
        return ResponseEntity.ok(practicalExamService.passExam(dto));
    }

    @PatchMapping("/inst/fail")
    public ResponseEntity<PracticalExamDTO> failExam(PracticalExamDTO dto){
        return ResponseEntity.ok(practicalExamService.failExam(dto));
    }


}
