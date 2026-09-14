package com.example.carschool.controller;


import com.example.carschool.dto.InstructorAssignmentDTO;
import com.example.carschool.dto.UsersDTO;
import com.example.carschool.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;


    @GetMapping("/get-candidates")
    public ResponseEntity<List<UsersDTO>> getCandidatesForAssignment(){
        return ResponseEntity.ok(adminService.getCandidatesForAssignment());
    }

    @GetMapping("/get-instructors")
    public ResponseEntity<List<UsersDTO>> getAvailableInstructors(){
        return ResponseEntity.ok(adminService.getAvailableInstructors());
    }

    @PatchMapping("/assign-inst")
    public ResponseEntity<?> assignInstructor(@RequestBody InstructorAssignmentDTO dto){
        try {
            adminService.assignInstructor(dto);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
