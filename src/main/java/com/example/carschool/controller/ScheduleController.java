package com.example.carschool.controller;

import com.example.carschool.dto.*;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.ClassRequest;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.Preference;
import com.example.carschool.service.*;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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
    @Autowired
    private ClassRequestService classRequestService;

    @GetMapping("/inst/candidate-prefs")
    public ResponseEntity<List<CandidatePreferencesDTO>> getCandidatesPrefs(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);

        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(preferenceService.getWeeklyPreferencesByInstructor(instructor.getId()));
    }

    //get schedule

    @GetMapping("/inst/get")
    public ResponseEntity<List<PracticalClassDTO>> getInstructorSchedule(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(scheduleService.getInstructorSchedule(instructor));
    }


    @GetMapping("/cand/get-cand")
    public ResponseEntity<List<PracticalClassDTO>> getCandidateSchedule(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);
        return ResponseEntity.ok(scheduleService.getCandidateSchedule(candidate));
    }








    //make schedule

    @PostMapping("/inst/create-class")
    public ResponseEntity<PracticalClassDTO> createClass(@RequestBody CreateClassDTO createClassDTO, HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);

        return ResponseEntity.ok(scheduleService.createAClass(createClassDTO, instructor));
    }

    @PostMapping("/inst/create-manual")
    public ResponseEntity<List<PracticalClassDTO>> createManual(HttpServletRequest request, @RequestBody List<CreateClassDTO> dtos) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(scheduleService.createManualSchedule(dtos,instructor));
    }

    @GetMapping("/inst/copy")
    public ResponseEntity<List<CreateClassDTO>> copySchedule(HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(scheduleService.copySchedule(instructor));
    }


    //requests
    @PatchMapping("/cand/accept-class/{class_id}")
    public ResponseEntity<?> acceptClass(@PathVariable Long class_id) {
        scheduleService.acceptClass(class_id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/cand/request-class")
    public ResponseEntity<?> requestClass(@RequestBody TimePrefDTO dto,HttpServletRequest request) {

        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);
        scheduleService.requestClass(dto,candidate);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cand/decline-class/{class_id}")
    public ResponseEntity<?> declineClass(@PathVariable Long class_id) {

        scheduleService.declineClass(class_id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inst/requests")
    public ResponseEntity<List<ClassRequestDTO>> getInstructorRequests(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        return ResponseEntity.ok(classRequestService.getInstructorRequests(instructor));
    }

    @DeleteMapping("/inst/delete/{requestId}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long requestId ) {

            classRequestService.deleteRequest(requestId);
            return ResponseEntity.ok().build();
    }

    @PatchMapping("/inst/request-class/{requestId}")
    @Transactional
    public ResponseEntity<?> createClassFromRequest(@RequestBody CreateClassDTO createClassDTO,@PathVariable Long requestId,HttpServletRequest request) {

        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        var createdClass = scheduleService.createAClass(createClassDTO, instructor);
        classRequestService.deleteRequest(requestId);
        return ResponseEntity.ok(createdClass);

    }



}
