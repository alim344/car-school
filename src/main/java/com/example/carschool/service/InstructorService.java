package com.example.carschool.service;

import com.example.carschool.dto.InstructorDashboardDTO;
import com.example.carschool.dto.PracticalClassDTO;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.PracticalClass;
import com.example.carschool.repo.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InstructorService {

    @Autowired
    private  InstructorRepository instructorRepository;
    @Autowired
    private PracticalClassService practicalClassService;
    @Autowired
    private ClassRequestService classRequestService;


    public Instructor findByEmail(String email) {
        return instructorRepository.findByEmail(email);
    }

    public InstructorDashboardDTO getDashboardInfo(String instructorEmail) {

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);


        Instructor instructor = findByEmail(instructorEmail);
        Integer studentNum = instructor.getCandidates().size();
        List<PracticalClass> pc = practicalClassService.getPeriodInstructorClasses(instructor, startOfDay, endOfDay);
        Integer classesTodayNum = pc.size();
        Integer requestNum = classRequestService.getNumberOfClassRequests(instructor);

        List<PracticalClassDTO> pcDto = pc.stream().map(PracticalClassDTO::new).toList();

        InstructorDashboardDTO dto = new InstructorDashboardDTO();
        dto.setRequestNum(requestNum);
        dto.setStudentsNum(studentNum);
        dto.setTodayClassesNum(classesTodayNum);
        dto.setTodayClasses(pcDto);

        return dto;
    }

}
