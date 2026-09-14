package com.example.carschool.controller;

import com.example.carschool.dto.AdminLeaveResponseDTO;
import com.example.carschool.dto.LeaveRequestDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.service.CandidateService;
import com.example.carschool.service.InstructorLeaveService;
import com.example.carschool.service.InstructorService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.antlr.v4.runtime.Token;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave")
public class LeaveRequestController {

    @Autowired
    private InstructorLeaveService instructorLeaveService;

    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private InstructorService instructorService;
    @Autowired
    private CandidateService candidateService;

    @GetMapping("/inst/get")
    public ResponseEntity<List<LeaveRequestDTO>> getByInstructor(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);

        return ResponseEntity.ok(instructorLeaveService.getLeaveRequestsByInstructor(instructor));
    }


    @PostMapping("/inst/create")
    public ResponseEntity<?> createRequest(@RequestBody LeaveRequestDTO leaveRequestDTO,HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);


        instructorLeaveService.createLeaveRequest(leaveRequestDTO,instructor);
        return ResponseEntity.ok().build();
    }


    @PatchMapping("/handle")
    public ResponseEntity<?> handleRequest(@RequestBody AdminLeaveResponseDTO adminLeaveResponseDTO){

        instructorLeaveService.handleRequest(adminLeaveResponseDTO);
        return ResponseEntity.ok().build();

    }

    @GetMapping("/getAll")
    public ResponseEntity<List<LeaveRequestDTO>> getAllLeaveRequests(){
        return ResponseEntity.ok(instructorLeaveService.getAllLeaveRequests());
    }

    @GetMapping("/get-approved")
    public ResponseEntity<List<LeaveRequestDTO>> getApprovedLeaveRequests(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(instructorLeaveService.getApprovedRequestsByInstructor(instructor));
    }

    @GetMapping("/cand-get")
    public ResponseEntity<List<LeaveRequestDTO>> getApprovedLeaveRequestsByInstructor(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);
        return ResponseEntity.ok(instructorLeaveService.getApprovedRequestsByInstructor(candidate.getInstructor()));
    }


}
