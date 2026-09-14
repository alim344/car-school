package com.example.carschool.service;

import com.example.carschool.dto.InstructorAssignmentDTO;
import com.example.carschool.dto.InstructorDTO;
import com.example.carschool.dto.TimeDTO;
import com.example.carschool.dto.UsersDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.AdminRepository;
import com.example.carschool.repo.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private CandidateService candidateService;
    @Autowired
    private InstructorRepository instructorRepository;


    public Admin findByEmail(String email){
        return adminRepository.findByEmail(email);
    }

    public List<InstructorDTO> getAvailableAdmins(TimeDTO time){
        List<InstructorDTO> dtos = new ArrayList<>();
        LocalDateTime endTime = time.getStartTime().plusMinutes(90);
        List<Admin> admins = adminRepository.findAvailableAdminsBetween(time.getStartTime(), endTime,ExamStatus.CANCELLED);
        for(Admin admin : admins){
            InstructorDTO instructorDTO = new InstructorDTO();
            instructorDTO.setEmail(admin.getEmail());
            instructorDTO.setName(admin.getName() + " " + admin.getLastname());
            dtos.add(instructorDTO);
        }
        return dtos;
    }





    //assign candidate to instructor


    public List<UsersDTO> getCandidatesForAssignment(){
        List<Candidate> candidates = candidateService.getCandidatesByStatus(TrainingStatus.WAITING_FOR_INSTRUCTOR);
        return candidates.stream().map(UsersDTO::new).toList();
    }


    public List<UsersDTO> getAvailableInstructors(){

        List<Instructor> instructors = instructorRepository.findAll();
        List<UsersDTO> dtos = new ArrayList<>();
        for(Instructor i : instructors){
            int currentCount = (int) candidateService.countByInstructor(i);
            int free = i.getMaxCapacity() - currentCount;
            if(free > 0){
                dtos.add(new UsersDTO(i,free));
            }

        }
        dtos.sort(Comparator.comparingInt(UsersDTO::getAvailableSpots).reversed());
        return dtos;

    }



    @Transactional
    public void assignInstructor(InstructorAssignmentDTO dto){

        Instructor instructor = instructorRepository.findByEmail(dto.getInstructor_email());
        if(instructor == null){
            throw new IllegalArgumentException("instructor not found");
        }
        candidateService.assignInstructor(dto.getCandidate_emails(), instructor);

    }





}
