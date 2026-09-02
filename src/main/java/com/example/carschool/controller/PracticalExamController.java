package com.example.carschool.controller;

import com.example.carschool.dto.CreateExamDTO;
import com.example.carschool.dto.InstructorDTO;
import com.example.carschool.dto.PracticalExamDTO;
import com.example.carschool.dto.TimeDTO;
import com.example.carschool.model.Admin;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.ExamStatus;
import com.example.carschool.model.Instructor;
import com.example.carschool.service.AdminService;
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
    @Autowired
    private AdminService adminService;

    @GetMapping("/admin/getAll")
    public ResponseEntity<List<PracticalExamDTO>> getAllPracticalExams() {
        return ResponseEntity.ok(practicalExamService.getAll());
    }


    @GetMapping("/admin/getScheduled")
    public ResponseEntity<List<PracticalExamDTO>> getScheduledPracticalExams() {
        return ResponseEntity.ok(practicalExamService.getExamsByStatus(ExamStatus.SCHEDULED));
    }

    @GetMapping("/admin/getPassed")
    public ResponseEntity<List<PracticalExamDTO>> getPassedPracticalExams() {
        return ResponseEntity.ok(practicalExamService.getExamsByStatus(ExamStatus.COMPLETED));
    }


    @GetMapping("/admin/getFailed")
    public ResponseEntity<List<PracticalExamDTO>> getFailedPracticalExams() {
        return ResponseEntity.ok(practicalExamService.getExamsByStatus(ExamStatus.FAILED));
    }

    @GetMapping("/admin/getCancelled")
    public ResponseEntity<List<PracticalExamDTO>> getCancelledPracticalExams() {
        return ResponseEntity.ok(practicalExamService.getExamsByStatus(ExamStatus.CANCELLED));
    }


    @GetMapping("/admin/schedule")
    public ResponseEntity<List<PracticalExamDTO>> getAdminSchedule(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Admin admin = adminService.findByEmail(email);
        return ResponseEntity.ok(practicalExamService.getByAdmin(admin));
    }


    @GetMapping("/cand/get")
    public ResponseEntity<List<PracticalExamDTO>> getByCandidate(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);
        return ResponseEntity.ok(practicalExamService.getByCandidate(candidate));
    }


    @PostMapping("/admin/schedule")
    public ResponseEntity<PracticalExamDTO> scheduleExam(@RequestBody CreateExamDTO dto){
        return ResponseEntity.ok(practicalExamService.createExam(dto));
    }


    @PatchMapping("/admin/cancel")
    public ResponseEntity<PracticalExamDTO> cancelExam(@RequestBody PracticalExamDTO dto){
        return ResponseEntity.ok(practicalExamService.cancelExam(dto));
    }

    @PatchMapping("/admin/pass")
    public ResponseEntity<PracticalExamDTO> passExam(@RequestBody PracticalExamDTO dto){
        return ResponseEntity.ok(practicalExamService.passExam(dto));
    }

    @PatchMapping("/admin/fail")
    public ResponseEntity<PracticalExamDTO> failExam(@RequestBody PracticalExamDTO dto){
        return ResponseEntity.ok(practicalExamService.failExam(dto));
    }


    @PostMapping("/admin/get-available")
    public ResponseEntity<List<InstructorDTO>> getAvailableAdmins(@RequestBody TimeDTO timeDTO){
        return ResponseEntity.ok(adminService.getAvailableAdmins(timeDTO));
    }




}
