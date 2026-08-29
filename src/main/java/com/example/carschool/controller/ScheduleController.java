package com.example.carschool.controller;

import com.example.carschool.dto.CandidatePreferencesDTO;
import com.example.carschool.dto.CreateClassDTO;
import com.example.carschool.dto.PracticalClassDTO;
import com.example.carschool.dto.TimePrefDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.Preference;
import com.example.carschool.service.CandidateService;
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
    @Autowired
    private CandidateService candidateService;

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


    @GetMapping("/get-cand")
    public ResponseEntity<List<PracticalClassDTO>> getCandidateSchedule(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);
        return ResponseEntity.ok(scheduleService.getCandidateSchedule(candidate));
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

    @GetMapping("/copy")
    public ResponseEntity<List<CreateClassDTO>> copySchedule(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(scheduleService.copySchedule(instructor));
    }


    //requests
    @PatchMapping("/accept-class/{class_id}")
    public ResponseEntity<?> acceptClass(@PathVariable Long class_id) {
        scheduleService.acceptClass(class_id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/request-class")
    public ResponseEntity<?> requestClass(@RequestBody TimePrefDTO dto,HttpServletRequest request) {

        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);
        scheduleService.requestClass(dto,candidate);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/decline-class/{class_id}")
    public ResponseEntity<?> declineClass(@PathVariable Long class_id) {

        scheduleService.declineClass(class_id);
        return ResponseEntity.ok().build();
    }

}
