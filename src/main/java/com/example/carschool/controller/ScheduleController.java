package com.example.carschool.controller;

import com.example.carschool.dto.*;
import com.example.carschool.model.*;
import com.example.carschool.service.*;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
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
    @Autowired
    private ScheduleGeneratorService scheduleGeneratorService;
    @Autowired
    private NotificationService notificationService;


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

    @PostMapping("/inst/alg")
    public ResponseEntity<List<CreateClassDTO>> algSchedule(@RequestBody AlgScheduleDTO dto, HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);

        List<Candidate> candidates = candidateService.getCandidatesByEmail(dto.getCandidate_emails());
        if(candidates.size() > 12) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Too many candidates");
        }

        LocalDate today = LocalDate.now();

        LocalDate nextWeekStart = today
                .with(TemporalAdjusters.next(DayOfWeek.MONDAY));


        return ResponseEntity.ok(scheduleGeneratorService.generateDraftSchedule(instructor,nextWeekStart,dto,candidates));

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
        Candidate candidate = candidateService.getByEmail(createdClass.getCandidateEmail());
        notificationService.createNotification(NotificationType.CLASS_REQUEST_ACCEPTED, createdClass.getId(),candidate.getId(),createClassDTO.getStartTime().toString());
        return ResponseEntity.ok(createdClass);

    }





}
