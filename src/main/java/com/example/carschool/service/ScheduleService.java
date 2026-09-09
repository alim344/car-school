package com.example.carschool.service;

import com.example.carschool.dto.*;
import com.example.carschool.model.*;
import com.example.carschool.repo.ClassRequestRepository;
import com.example.carschool.repo.PracticalClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class ScheduleService {

    @Autowired
    private  CandidateService candidateService;
    @Autowired
    private PracticalClassService practicalClassService;
    @Autowired
    private ClassRequestRepository classRequestRepository;

    @Autowired
    private InstructorLeaveService instructorLeaveService;



    public List<PracticalClassDTO> getInstructorSchedule(Instructor instructor) {
        List<PracticalClass> classes = practicalClassService.findByInstructor(instructor);
        List<PracticalClassDTO> practicalClassDTOS = new ArrayList<>();
        for (PracticalClass practicalClass : classes) {
            practicalClassDTOS.add(new PracticalClassDTO(practicalClass));
        }
        return practicalClassDTOS;
    }

    public List<PracticalClassDTO> getCandidateSchedule(Candidate candidate) {
        List<PracticalClass> classes = practicalClassService.findByCandidate(candidate);
        List<PracticalClassDTO> practicalClassDTOS = new ArrayList<>();
        for (PracticalClass practicalClass : classes) {
            practicalClassDTOS.add(new PracticalClassDTO(practicalClass));
        }
        return practicalClassDTOS;
    }



    public PracticalClassDTO createAClass(CreateClassDTO createClassDTO, Instructor instructor) {
        PracticalClass pc = new PracticalClass();


        boolean conflict = practicalClassService.classExists(instructor,createClassDTO.getEndTime(),createClassDTO.getStartTime());


        if (conflict) {
            throw new IllegalArgumentException(
                    "Instructor already has a class during this time.");}

        if (instructorLeaveService.isOnLeave(instructor, createClassDTO.getStartTime().toLocalDate())) {
            throw new IllegalArgumentException("Instructor is on approved leave during this time.");
        }

        if (createClassDTO.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot schedule a class in the past.");
        }

        if (createClassDTO.getStartTime().isBefore(LocalDateTime.now().plusMinutes(10))) {
            throw new IllegalArgumentException("Start time must be at least 10 minutes from now.");
        }

        if (!createClassDTO.getEndTime().isAfter(createClassDTO.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time.");
        }



        pc.setClassStatus(ClassStatus.PENDING);
        pc.setInstructor(instructor);
        pc.setScheduledStartTime(createClassDTO.getStartTime());
        pc.setScheduledEndTime(createClassDTO.getEndTime());
        Candidate candidate = candidateService.getByEmail(createClassDTO.getCandidateEmail());
        pc.setCandidate(candidate);



        if(createClassDTO.getLocation().isEmpty()){
            pc.setLocation(candidate.getLocation());
        }else{
            pc.setLocation(createClassDTO.getLocation());
        }

        practicalClassService.save(pc);
        return new PracticalClassDTO(pc);

    }

    public List<PracticalClassDTO> createManualSchedule(List<CreateClassDTO> createClassDTO, Instructor instructor) {

        List<PracticalClassDTO> practicalClassDTOList = new ArrayList<>();

        for(CreateClassDTO dto : createClassDTO) {
            practicalClassDTOList.add(createAClass(dto, instructor));
        }

        return practicalClassDTOList;
    }


    public List<CreateClassDTO> copySchedule(Instructor instructor) {
        List<CreateClassDTO> ClassDTOList = new ArrayList<>();

        LocalDate today = LocalDate.now();

        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        LocalDateTime start = startOfWeek.atStartOfDay();
        LocalDateTime end = endOfWeek.atTime(LocalTime.MAX);

        List<PracticalClass> practicalClasses = practicalClassService.getPeriodInstructorClasses(instructor,start,end);

        Map<Long, Integer> candidateClassCounter = new HashMap<>();

        for(PracticalClass pc : practicalClasses){

            Candidate candidate = pc.getCandidate();

            //continue if last week he had his last class
            if(candidate.getStatus() == TrainingStatus.PENDING){
                continue;
            }

            //save only one class, if it is his last

            int currentCount = candidateClassCounter.getOrDefault(
                    candidate.getId(),
                    candidate.getNumberOfCompletedClasses()
            );


            if(currentCount >= candidate.getTotalRequiredClasses()){
                continue;
            }

            candidateClassCounter.put(candidate.getId(), currentCount + 1);


            start = pc.getScheduledStartTime();
            end = pc.getScheduledEndTime();

            LocalDateTime shiftedStart = start.plusWeeks(1);
            LocalDateTime shiftedEnd = end.plusWeeks(1);

            if (instructorLeaveService.isOnLeave(instructor, shiftedStart.toLocalDate())) {
                continue;
            }




            pc.setScheduledStartTime(shiftedStart);
            pc.setScheduledEndTime(shiftedEnd);
            ClassDTOList.add(new CreateClassDTO(pc));

        }

        return ClassDTOList;

    }


    //requests

    public void acceptClass(Long pc_id){
        PracticalClass pc = practicalClassService.findById(pc_id);
        pc.setClassStatus(ClassStatus.ACCEPTED);
        practicalClassService.save(pc);
    }


    @Transactional
    public void requestClass(TimePrefDTO dto, Candidate candidate){

        ClassRequest request = new ClassRequest();
        request.setStartTime(dto.getStartTime());
        request.setEndTime(dto.getEndTime());
        request.setCandidate(candidate);
        request.setDate(dto.getDate());
        request.setInstructor(candidate.getInstructor());
        classRequestRepository.save(request);

        practicalClassService.deleteById(dto.getId());

    }

    public void declineClass(Long pc_id){
        practicalClassService.deleteById(pc_id);
    }

}
