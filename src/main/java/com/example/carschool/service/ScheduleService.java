package com.example.carschool.service;

import com.example.carschool.dto.CreateClassDTO;
import com.example.carschool.dto.PracticalClassDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.ClassStatus;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.PracticalClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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


    public List<PracticalClassDTO> getInstructorSchedule(Instructor instructor) {
        List<PracticalClass> classes = practicalClassService.findByInstructor(instructor);
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


}
