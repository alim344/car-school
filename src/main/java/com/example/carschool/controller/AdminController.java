package com.example.carschool.controller;


import com.example.carschool.dto.AssignmentResultDTO;
import com.example.carschool.dto.InstructorAssignmentDTO;
import com.example.carschool.dto.InstructorCandidatesDTO;
import com.example.carschool.dto.UsersDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.service.AdminService;
import com.example.carschool.service.PreferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private PreferenceService preferenceService;


    @GetMapping("/get-candidates")
    public ResponseEntity<List<UsersDTO>> getCandidatesForAssignment(){
        return ResponseEntity.ok(adminService.getCandidatesForAssignment());
    }

    @GetMapping("/get-instructors")
    public ResponseEntity<List<UsersDTO>> getAvailableInstructors(){
        return ResponseEntity.ok(adminService.getAvailableInstructors());
    }

    @PatchMapping("/assign-inst")
    @Transactional
    public ResponseEntity<?> assignInstructor(@RequestBody InstructorAssignmentDTO dto){
        try {
            adminService.assignInstructor(dto);

            for(String email: dto.getCandidate_emails()){
                preferenceService.noPrefByEmail(email);
            }


            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }




    @PatchMapping("/assign-all")
    public ResponseEntity<List<AssignmentResultDTO>> assignAll(){
        return ResponseEntity.ok(adminService.assignAll());
    }

    @PatchMapping("/save-assigned")
    public ResponseEntity<?> saveAllAssigned(@RequestBody List<AssignmentResultDTO> dtos){
        adminService.saveAllAssigned(dtos);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inst-cand")
    public ResponseEntity<List<InstructorCandidatesDTO>> getInstructorsCandidates(){
        return ResponseEntity.ok(adminService.getInstructorCandidates());
    }

    @PatchMapping("/inactivate/{email}")
    public ResponseEntity<?> inactivate(@PathVariable String email){
        adminService.inactivate(email);
        return ResponseEntity.ok().build();
    }


    @PatchMapping("/activate/{email}")
    public ResponseEntity<?> activate(@PathVariable String email){
        adminService.activate(email);
        return ResponseEntity.ok().build();
    }



}
