package com.example.carschool.service;

import com.example.carschool.dto.*;
import com.example.carschool.model.*;
import com.example.carschool.repo.PracticalClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class PracticalClassService {

    @Autowired
    private PracticalClassRepository practicalClassRepository;

    @Autowired
    private RouteService routeService;
    @Autowired
    private CandidateService candidateService;
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PracticalExamService practicalExamService;

    public PracticalClass findById(Long id){
        return practicalClassRepository.findById(id).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"PracticalClass not found with id: " + id));
    }


    public boolean checkStartedClasses(Instructor instructor){
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<PracticalClass> practicalClasses = getPeriodInstructorClasses(instructor, startOfDay, endOfDay);

        return practicalClasses.stream().anyMatch(pc -> pc.getClassStatus() == ClassStatus.STARTED);

    }

    @Transactional
    public void startClass(Long id, Instructor instructor){
        PracticalClass practicalClass = findById(id);

        if(practicalClass.getClassStatus() == ClassStatus.STARTED){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Class is already started");
        }

        if(checkStartedClasses(instructor)){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"U cant start the class, when other classes are in session");
        }

        practicalClass.setClassStatus(ClassStatus.STARTED);
        practicalClass.setActualStartTime(LocalDateTime.now());
        practicalClassRepository.save(practicalClass);
    }

    @Transactional
    public PracticalClassDTO setRoute(Long id, Long routeId){
        PracticalClass practicalClass = findById(id);

        Route route = routeService.findById(routeId);
        practicalClass.setRoute(route);
        practicalClassRepository.save(practicalClass);
       return new PracticalClassDTO(practicalClass);
    }

    @Transactional
    public PracticalClassDTO endClass(EndClassDTO dto){
        PracticalClass pc = findById(dto.getId());

        if(pc.getClassStatus() != ClassStatus.STARTED){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Class hasnt started");
        }

        Candidate candidate = pc.getCandidate();

        if(dto.isLastClass()){
            candidate.setStatus(TrainingStatus.PENDING);
        }


        pc.setClassStatus(ClassStatus.ENDED);
        pc.setActualEndTime(LocalDateTime.now());
        pc.setComment(dto.getComment());
        pc.setGrade(dto.getGrade());
        pc.setRemarks(dto.getRemarks());


        Integer numOfClasses = candidate.getNumberOfCompletedClasses();
        candidate.setNumberOfCompletedClasses(numOfClasses + 1);

        if(dto.getExtraClasses() != null){
            Integer required = candidate.getTotalRequiredClasses();
            candidate.setTotalRequiredClasses(required + dto.getExtraClasses());
        }

        candidateService.save(candidate);

        if(dto.getRouteId() != null){
            Route route = routeService.findById(dto.getRouteId());
            pc.setRoute(route);
        }

        PracticalClass saved = practicalClassRepository.save(pc);
        notificationService.createNotification(NotificationType.CLASS_FINISHED,saved.getId(),candidate.getId(),saved.getScheduledStartTime().toString());
        return new PracticalClassDTO(saved);
    }

    @Transactional
    public PracticalClassDTO interruptClass(InterruptionClassDTO dto){
        PracticalClass pc = findById(dto.getClassId());
        if(pc.getClassStatus() != ClassStatus.STARTED){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Class hasnt started");
        }
        pc.setClassStatus(ClassStatus.BAD_END);
        pc.setActualEndTime(LocalDateTime.now());
        String reason = dto.getReason();
        if(reason.equalsIgnoreCase("WEATHER")){
            pc.setInterruptionReason(InterruptionReason.WEATHER);
        }else if(reason.equalsIgnoreCase("ACCIDENT")){
            pc.setInterruptionReason(InterruptionReason.ACCIDENT);
        }else if(reason.equalsIgnoreCase("CANDIDATE_ILLNESS")){
            pc.setInterruptionReason(InterruptionReason.CANDIDATE_ILLNESS);
        }else if(reason.equalsIgnoreCase("INSTRUCTOR_EMERGENCY")){
            pc.setInterruptionReason(InterruptionReason.INSTRUCTOR_EMERGENCY);
        }else if(reason.equalsIgnoreCase("VEHICLE_MALFUNCTION")){
            pc.setInterruptionReason(InterruptionReason.VEHICLE_MALFUNCTION);
        }else{
            pc.setInterruptionReason(InterruptionReason.OTHER);
        }
        pc.setInterruptionNote(dto.getNote());
        PracticalClass saved = practicalClassRepository.save(pc);
        notificationService.createNotification(NotificationType.CLASS_FINISHED,saved.getId(),saved.getCandidate().getId(),saved.getScheduledStartTime().toString());
        return new PracticalClassDTO(pc);
    }






    public List<PracticalClass> findByInstructor(Instructor instructor){
        return practicalClassRepository.findByInstructor(instructor);
    }

    public List<PracticalClass> findByCandidate(Candidate candidate){
        return practicalClassRepository.findByCandidate(candidate);
    }


    public List<PracticalClass> getPeriodInstructorClasses(Instructor instructor,LocalDateTime startTime,LocalDateTime endTime){

        List<PracticalClass> pc = practicalClassRepository.findByInstructorAndScheduledStartTimeBetween(instructor, startTime, endTime);
        return pc;
    }

    @Transactional
    public void cancelClass(Long classId){
        PracticalClass practicalClass = findById(classId);

        if(practicalClass == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"PracticalClass not found with id: " + classId);
        }

        practicalClass.setClassStatus(ClassStatus.CANCELLED);
        practicalClassRepository.save(practicalClass);
        notificationService.createNotification(NotificationType.CLASS_CANCELLED,classId,practicalClass.getCandidate().getId(),practicalClass.getScheduledStartTime().toString());
    }

    public void save(PracticalClass practicalClass){
        practicalClassRepository.save(practicalClass);
    }

    public void delete(PracticalClass practicalClass){
        practicalClassRepository.delete(practicalClass);
    }

    public void deleteById(Long id){
        practicalClassRepository.deleteById(id);
    }

    public boolean classExists(Instructor instructor, LocalDateTime endTime, LocalDateTime startTime){
        return
                practicalClassRepository
                        .existsByInstructorAndScheduledStartTimeLessThanAndScheduledEndTimeGreaterThan(
                                instructor,
                                startTime,endTime
                        );


    }


    public List<PracticalClass> getByInstructorAndWeek(Instructor instructor){

        LocalDate today = LocalDate.now();

        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        LocalDateTime start = startOfWeek.atStartOfDay();
        LocalDateTime end = endOfWeek.atTime(LocalTime.MAX);

        return practicalClassRepository.findByInstructorAndScheduledStartTimeLessThanAndScheduledEndTimeGreaterThan(instructor, start, end);
    }

    @Transactional
    public List<PracticalClassDTO> cancelByDay(Instructor instructor){

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfNextDay = startOfDay.plusDays(1);

        List<PracticalClass> classes = practicalClassRepository.findByInstructorAndScheduledStartTimeBetween(instructor,now,startOfNextDay);


        for(PracticalClass pc : classes){

            if(pc.getClassStatus() != ClassStatus.CANCELLED && pc.getClassStatus() != ClassStatus.REJECTED){
                pc.setClassStatus(ClassStatus.CANCELLED);
                if(pc.getClassStatus() == ClassStatus.STARTED){
                    pc.setActualEndTime(LocalDateTime.now());
                }
                practicalClassRepository.save(pc);
                notificationService.createNotification(NotificationType.CLASS_CANCELLED,pc.getId(),pc.getCandidate().getId(),pc.getScheduledStartTime().toString());
            }

        }



        return classes.stream().map(PracticalClassDTO::new).toList();

    }


    @Transactional
    public void cancelClasses(LocalDateTime startTime, LocalDateTime endTime){
       List<PracticalClass> pclasses =  practicalClassRepository.findByScheduledStartTimeBetween(startTime,endTime);
       for(PracticalClass pc : pclasses){
           pc.setClassStatus(ClassStatus.CANCELLED);
           practicalClassRepository.save(pc);
           notificationService.createNotification(NotificationType.CLASS_CANCELLED,pc.getId(),pc.getCandidate().getId(),pc.getScheduledStartTime().toString());

       }
    }

    public PracticalClass saveClass(PracticalClass pc){
        return practicalClassRepository.save(pc);
    }


    public CandidateProfileDTO getAllABoutCandidate(Long candidateId){
        Candidate candidate = candidateService.getById(candidateId);
        if(candidate == null){
            throw new IllegalArgumentException("Candidate doesnt exist");
        }
        List<PracticalClass> classes = practicalClassRepository.findByCandidateOrderByScheduledStartTimeDesc(candidate);
        List<PracticalClassDTO> dtos = new ArrayList<>();
        int count = 0;
        int total = 0;

        List<Integer> grades = new ArrayList<>();
        for(PracticalClass pc : classes){

            PracticalClassDTO dto = new PracticalClassDTO(pc);
            if(pc.getClassStatus() == ClassStatus.ENDED){
                count++;
                total+= pc.getGrade();
                grades.add(pc.getGrade());
            }
            dtos.add(dto);

        }

        double avg = (double) total /count;


        List<PracticalExamDTO> examDtos = practicalExamService.getByCandidate(candidate);


        return new  CandidateProfileDTO(candidate,dtos,avg,grades,examDtos);




    }


    public Route getRouteForClass(Long id){
        PracticalClass pclass = practicalClassRepository.findById(id).get();

        return pclass.getRoute();
    }

}
