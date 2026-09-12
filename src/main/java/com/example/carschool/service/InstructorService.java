package com.example.carschool.service;

import com.example.carschool.dto.InstructorDTO;
import com.example.carschool.dto.InstructorDashboardDTO;
import com.example.carschool.dto.PracticalClassDTO;
import com.example.carschool.dto.VehicleInstructorDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.NotificationType;
import com.example.carschool.model.PracticalClass;
import com.example.carschool.repo.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class InstructorService {

    @Autowired
    private  InstructorRepository instructorRepository;
    @Autowired
    private PracticalClassService practicalClassService;
    @Autowired
    private ClassRequestService classRequestService;

    @Autowired
    private NotificationService notificationService;


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

        List<PracticalClassDTO> pcDto = new ArrayList<>();

        for(PracticalClass practicalClass : pc) {

            Candidate candidate = practicalClass.getCandidate();
            PracticalClassDTO dto = new PracticalClassDTO(practicalClass);
            if (candidate.getTotalRequiredClasses() - candidate.getNumberOfCompletedClasses() == 1){
                dto.setLastClass(true);
            }

            pcDto.add(dto);
        }

        InstructorDashboardDTO dto = new InstructorDashboardDTO();
        dto.setRequestNum(requestNum);
        dto.setStudentsNum(studentNum);
        dto.setTodayClassesNum(classesTodayNum);
        dto.setTodayClasses(pcDto);



        return dto;
    }


    public List<InstructorDTO> getALl(){
        List<Instructor> all = instructorRepository.findAll();
        List<InstructorDTO> dtos = new ArrayList<>();
        for (Instructor instructor : all) {
            dtos.add(new InstructorDTO(instructor));
        }
        return dtos;
    }

    public void save(Instructor instructor) {
        instructorRepository.save(instructor);
    }

    public List<VehicleInstructorDTO> getInstructorsForVehicleAssignment(){
        List<Instructor> instructors = instructorRepository.findByVehicleIsNull();
        return instructors.stream().map(VehicleInstructorDTO::new).toList();
    }



    @Scheduled(cron = "0 0 12 * * SAT")
    public void createWeeklyScheduleReminder(){
        List<Instructor> instructors = instructorRepository.findAll();
        instructors.forEach(i-> notificationService.createNotification(NotificationType.WEEKLY_SCHEDULE_REMINDER,null,i.getId()));

    }

}
