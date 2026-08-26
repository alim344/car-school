package com.example.carschool.controller;

import com.example.carschool.dto.CandidatePreferencesDTO;
import com.example.carschool.dto.CreateClassDTO;
import com.example.carschool.dto.PracticalClassDTO;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.Preference;
import com.example.carschool.service.InstructorService;
import com.example.carschool.service.PreferenceService;
import com.example.carschool.service.ScheduleService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {


    @Autowired
    private PreferenceService preferenceService;
    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private InstructorService instructorService;

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/candidate-prefs")
    public ResponseEntity<List<CandidatePreferencesDTO>> getCandidatesPrefs(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);

        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(preferenceService.getWeeklyPreferencesByInstructor(instructor.getId()));
    }

    //get schedule

    @GetMapping("/get-inst")
    public ResponseEntity<List<PracticalClassDTO>> getInstructorSchedule(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(scheduleService.getInstructorSchedule(instructor));
    }








    //make schedule

    @PostMapping("/create-class")
    public ResponseEntity<PracticalClassDTO> createClass(@RequestBody CreateClassDTO createClassDTO, HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);

        return ResponseEntity.ok(scheduleService.createAClass(createClassDTO, instructor));
    }

    @PostMapping("/create-manual")
    public ResponseEntity<List<PracticalClassDTO>> createManual(HttpServletRequest request, @RequestBody List<CreateClassDTO> dtos) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(scheduleService.createManualSchedule(dtos,instructor));
    }

}
