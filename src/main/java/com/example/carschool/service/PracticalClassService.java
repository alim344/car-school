package com.example.carschool.service;

import com.example.carschool.dto.EndClassDTO;
import com.example.carschool.dto.InterruptionClassDTO;
import com.example.carschool.dto.PracticalClassDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.PracticalClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class PracticalClassService {

    @Autowired
    private PracticalClassRepository practicalClassRepository;

    @Autowired
    private RouteService routeService;

    public PracticalClass findById(Long id){
        return practicalClassRepository.findById(id).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"PracticalClass not found with id: " + id));
    }

    @Transactional
    public void startClass(Long id){
        PracticalClass practicalClass = findById(id);

        if(practicalClass.getClassStatus() == ClassStatus.STARTED){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Class is already started");
        }

        practicalClass.setClassStatus(ClassStatus.STARTED);
        practicalClass.setActualStartTime(LocalDateTime.now());
        practicalClassRepository.save(practicalClass);
    }

    @Transactional
    public PracticalClass setRoute(Long id, Long routeId){
        PracticalClass practicalClass = findById(id);

        Route route = routeService.findById(routeId);
        practicalClass.setRoute(route);
        return practicalClassRepository.save(practicalClass);
    }

    @Transactional
    public PracticalClass endClass(EndClassDTO dto){
        PracticalClass pc = findById(dto.getId());

        if(pc.getClassStatus() != ClassStatus.STARTED){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Class hasnt started");
        }

        pc.setClassStatus(ClassStatus.ENDED);
        pc.setActualEndTime(LocalDateTime.now());
        pc.setComment(dto.getComment());
        pc.setGrade(dto.getGrade());
        pc.setRemarks(dto.getRemarks());
        return practicalClassRepository.save(pc);
    }

    @Transactional
    public PracticalClass interruptClass(InterruptionClassDTO dto){
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
        return practicalClassRepository.save(pc);
    }


    public List<PracticalClass> findByInstructor(Instructor instructor){
        return practicalClassRepository.findByInstructor(instructor);
    }

    public List<PracticalClass> getTodayInstructorClasses(Instructor instructor){

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<PracticalClass> pc = practicalClassRepository.findByInstructorAndScheduledStartTimeBetween(instructor, startOfDay, endOfDay);
        return pc;

    }

    public void cancelClass(Long classId){
        PracticalClass practicalClass = findById(classId);

        if(practicalClass == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"PracticalClass not found with id: " + classId);
        }

        practicalClass.setClassStatus(ClassStatus.CANCELLED);
        practicalClassRepository.save(practicalClass);
    }



}
