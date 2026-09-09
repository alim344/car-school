package com.example.carschool.controller;

import com.example.carschool.dto.LeaveRequestDTO;
import com.example.carschool.model.Instructor;
import com.example.carschool.service.InstructorLeaveService;
import com.example.carschool.service.InstructorService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.antlr.v4.runtime.Token;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/inst/get")
    public ResponseEntity<List<LeaveRequestDTO>> getByInstructor(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);

        return ResponseEntity.ok(instructorLeaveService.getLeaveRequestsByInstructor(instructor));
    }
}
