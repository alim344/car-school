package com.example.carschool.service;

import com.example.carschool.dto.CreateExamDTO;
import com.example.carschool.dto.InstructorDTO;
import com.example.carschool.dto.PracticalExamDTO;
import com.example.carschool.dto.TimeDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.PracticalExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;

@Service
public class PracticalExamService {


    @Autowired
    private PracticalExamRepository practicalExamRepository;
    @Autowired
    private CandidateService candidateService;
    @Autowired
    private AdminService adminService;


    public List<PracticalExamDTO> getAll(){
        List<PracticalExam> practicalExams = practicalExamRepository.findAllByOrderByDateTimeDesc();
        List<PracticalExamDTO> practicalExamDTOs = new ArrayList<>();
        for (PracticalExam practicalExam : practicalExams) {
            practicalExamDTOs.add(new PracticalExamDTO(practicalExam));
        }
        return practicalExamDTOs;
    }

    public List<PracticalExamDTO> getExamsByStatus(ExamStatus examStatus){
        List<PracticalExamDTO> practicalExamDTOs = new ArrayList<>();
        List<PracticalExam> exams = practicalExamRepository.findByStatusOrderByDateTimeDesc(examStatus);
        for (PracticalExam exam : exams) {
            practicalExamDTOs.add(new PracticalExamDTO(exam));
        }
        return practicalExamDTOs;
    }

    public List<PracticalExamDTO> getByAdmin(Admin admin){
        List<PracticalExamDTO> practicalExamDTOs = new ArrayList<>();
        List<PracticalExam> exams = practicalExamRepository.findByAdmin(admin);
        for (PracticalExam exam : exams) {
            practicalExamDTOs.add(new PracticalExamDTO(exam));

        }
        return practicalExamDTOs;
    }




    public List<PracticalExamDTO> getByCandidate(Candidate candidate){
        List<PracticalExam> practicalExams = practicalExamRepository.findByCandidate(candidate);
        List<PracticalExamDTO> practicalExamDTOs = new ArrayList<>();
        for (PracticalExam practicalExam : practicalExams) {
            practicalExamDTOs.add(new PracticalExamDTO(practicalExam));
        }
        return practicalExamDTOs;
    }

    public PracticalExamDTO createExam(CreateExamDTO createExamDTO){

        Candidate candidate = candidateService.getByEmail(createExamDTO.getCandidate_email());
        Admin admin = adminService.findByEmail(createExamDTO.getAdmin_email());


        PracticalExam practicalExam = new PracticalExam();
        practicalExam.setCandidate(candidate);
        practicalExam.setAdmin(admin);
        practicalExam.setDateTime(createExamDTO.getDateTime());
        practicalExam.setStatus(ExamStatus.SCHEDULED);
        practicalExamRepository.save(practicalExam);
        return new PracticalExamDTO(practicalExam);

    }

    public PracticalExamDTO cancelExam(PracticalExamDTO practicalExamDTO){
        PracticalExam pe = practicalExamRepository.findById(practicalExamDTO.getId()).orElse(null);
        pe.setStatus(ExamStatus.CANCELLED);
        practicalExamRepository.save(pe);
        return new PracticalExamDTO(pe);
    }


    public PracticalExamDTO passExam(PracticalExamDTO practicalExamDTO){
        PracticalExam pe = practicalExamRepository.findById(practicalExamDTO.getId()).orElse(null);
        pe.setStatus(ExamStatus.COMPLETED);
        pe.setScore(practicalExamDTO.getScore());
        practicalExamRepository.save(pe);
        return new PracticalExamDTO(pe);
    }

    public PracticalExamDTO failExam(PracticalExamDTO practicalExamDTO){
        PracticalExam pe = practicalExamRepository.findById(practicalExamDTO.getId()).orElse(null);
        pe.setStatus(ExamStatus.FAILED);
        pe.setScore(practicalExamDTO.getScore());
        practicalExamRepository.save(pe);
        return new PracticalExamDTO(pe);
    }



}
