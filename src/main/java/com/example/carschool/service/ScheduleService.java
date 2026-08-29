package com.example.carschool.service;

import com.example.carschool.dto.CandidatePreferencesDTO;
import com.example.carschool.dto.CreateClassDTO;
import com.example.carschool.dto.PracticalClassDTO;
import com.example.carschool.dto.TimePrefDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.ClassRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private  CandidateService candidateService;
    @Autowired
    private PracticalClassService practicalClassService;
    @Autowired
    private ClassRequestRepository classRequestRepository;


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
                    "Instructor already has a class during this time."
            );}
        pc.setClassStatus(ClassStatus.PENDING);
        pc.setInstructor(instructor);
        pc.setScheduledStartTime(createClassDTO.getStartTime());
        pc.setScheduledEndTime(createClassDTO.getEndTime());
        Candidate candidate = candidateService.getByEmail(createClassDTO.getCandidateEmail());
        pc.setCandidate(candidate);
        if(candidate.getLocation().isEmpty()){
            pc.setLocation(" ");
        }else{
            pc.setLocation(candidate.getLocation());
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

        for(PracticalClass pc : practicalClasses){
            start = pc.getScheduledStartTime();
            end = pc.getScheduledEndTime();
            pc.setScheduledStartTime(start.plusWeeks(1));
            pc.setScheduledEndTime(end.plusWeeks(1));
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
        classRequestRepository.save(request);

        practicalClassService.deleteById(dto.getId());

    }

    public void declineClass(Long pc_id){
        practicalClassService.deleteById(pc_id);
    }

}
