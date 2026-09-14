package com.example.carschool.controller;

import com.example.carschool.dto.CandidateDTO;
import com.example.carschool.dto.InstructorChangeRequestDTO;
import com.example.carschool.dto.InstructorDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.service.CandidateService;
import com.example.carschool.service.InstructorService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @GetMapping("/get-inst-name")
    public ResponseEntity<InstructorDTO> getInstructor(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);

        Instructor instructor = candidate.getInstructor();
        return ResponseEntity.ok(new InstructorDTO(instructor));
    }


    //instructor-change requests

    @PostMapping("/create-request")
    public ResponseEntity<?> createChangeRequest(@RequestBody InstructorChangeRequestDTO dto, HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);
        Instructor instructor = candidate.getInstructor();
        candidateService.createChangeRequest(dto,candidate,instructor);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/change-accept/{id}")
    public ResponseEntity<?> acceptRequest(@PathVariable Long id){
        candidateService.acceptRequest(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/change-decline/{id}")
    public ResponseEntity<?> declineRequest(@PathVariable Long id){
        candidateService.declineRequest(id);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/change-getALl")
    public ResponseEntity<List<InstructorChangeRequestDTO>> getALlChangeRequests() {
        return ResponseEntity.ok(candidateService.getAllChangeRequests());
    }


    @GetMapping("/change-get-candidate")
    public ResponseEntity<InstructorChangeRequestDTO> getByCandidate(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);
        return ResponseEntity.ok(candidateService.getRequestsByCandidate(candidate));
    }



}
