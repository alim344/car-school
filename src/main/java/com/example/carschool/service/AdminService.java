package com.example.carschool.service;

import com.example.carschool.dto.*;
import com.example.carschool.model.*;
import com.example.carschool.repo.AdminRepository;
import com.example.carschool.repo.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

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
            if(!i.isActive()){
                continue;
            }
            int currentCount = (int) candidateService.countByInstructor(i);
            int free = i.getMaxCapacity() - currentCount;
            if(free > 0){
                dtos.add(new UsersDTO(i,free));
            }

        }
        dtos.sort(Comparator.comparingInt(UsersDTO::getAvailableSpots).reversed());
        return dtos;

    }




    public void assignInstructor(InstructorAssignmentDTO dto){

        Instructor instructor = instructorRepository.findByEmail(dto.getInstructor_email());
        if(instructor == null){
            throw new IllegalArgumentException("instructor not found");
        }
        candidateService.assignInstructor(dto.getCandidate_emails(), instructor);

    }



    @Transactional
    public List<AssignmentResultDTO> assignAll(){

        List<Candidate> candidates = candidateService.getCandidatesByStatus(TrainingStatus.WAITING_FOR_INSTRUCTOR);
        List<Instructor> instructors = instructorRepository.findAll();


        candidates.sort(Comparator.comparing(Candidate::getTheoryPassedDate));

        Collections.shuffle(instructors);

        Map<Category, PriorityQueue<InstructorSlotDTO>> heapsByCategory = new HashMap<>();

        for(Instructor i : instructors){
             int currentCount = (int) candidateService.countByInstructor(i);
             int free = i.getMaxCapacity() - currentCount;
             if(free <= 0){
                 continue;
             }

             heapsByCategory.computeIfAbsent(i.getCategory(),c-> new PriorityQueue<>(Comparator.comparingInt(InstructorSlotDTO::getFreeSlots).reversed()))
                     .add(new InstructorSlotDTO(i,free));

        }


        List<AssignmentResultDTO> results = new ArrayList<>();

        for(Candidate c : candidates){
            PriorityQueue<InstructorSlotDTO> heap = heapsByCategory.get(c.getCategory());

            if(heap == null || heap.isEmpty()){
                continue;
            }

            InstructorSlotDTO top = heap.poll();
            Instructor instructor = top.getInstructor();

            /*c.setInstructor(instructor);
            candidateService.save(c);*/

            results.add(new AssignmentResultDTO(c.getEmail(), c.getName() + " " + c.getLastname(),instructor.getEmail(),instructor.getName() + " " + instructor.getLastname()));

            top.decrement();

            if(top.getFreeSlots() > 0){
                heap.add(top);
            }

        }

        return results;



    }


    @Transactional
    public void saveAllAssigned(List<AssignmentResultDTO> dtos){

        for(AssignmentResultDTO dto : dtos){
            Candidate candidate = candidateService.getByEmail(dto.getCandidateEmail());
            Instructor instructor = instructorRepository.findByEmail(dto.getInstructorEmail());
            candidate.setStatus(TrainingStatus.PRACTICAL);
            candidate.setInstructor(instructor);
            candidateService.save(candidate);
        }

    }

    public List<InstructorCandidatesDTO> getInstructorCandidates(){
        List<InstructorCandidatesDTO> dtos = new ArrayList<>();
        List<Instructor> instructors = instructorRepository.findAll();
        for(Instructor i : instructors){
            List<Candidate> candidates = candidateService.getActiveCandidatesByInstructor(i);
            List<CandidateDTO> candidateDTOS = candidates.stream().map(CandidateDTO::new).toList();
            dtos.add(new InstructorCandidatesDTO(i,candidateDTOS));

        }
        return dtos;
    }

    @Transactional
    public void inactivate(String instructor_email){
        Instructor instructor = instructorRepository.findByEmail(instructor_email);
        List<Candidate> candidates = candidateService.getActiveCandidatesByInstructor(instructor);
        candidates.forEach(c->{
            c.setStatus(TrainingStatus.WAITING_FOR_INSTRUCTOR);
            candidateService.save(c);
        });
        instructor.setActive(false);
        instructorRepository.save(instructor);
    }


    public void activate(String instructor_email){
        Instructor instructor = instructorRepository.findByEmail(instructor_email);
        instructor.setActive(true);
        instructorRepository.save(instructor);
    }



}
