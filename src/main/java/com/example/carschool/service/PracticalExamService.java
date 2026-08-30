package com.example.carschool.service;

import com.example.carschool.dto.CreateExamDTO;
import com.example.carschool.dto.PracticalExamDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.PracticalExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PracticalExamService {


    @Autowired
    private PracticalExamRepository practicalExamRepository;
    @Autowired
    private CandidateService candidateService;
    @Autowired
    private InstructorService instructorService;


    public List<PracticalExamDTO> getAll(){
        List<PracticalExam> practicalExams = practicalExamRepository.findAll();
        List<PracticalExamDTO> practicalExamDTOs = new ArrayList<>();
        for (PracticalExam practicalExam : practicalExams) {
            practicalExamDTOs.add(new PracticalExamDTO(practicalExam));
        }
        return practicalExamDTOs;
    }


    public List<PracticalExamDTO> getByInstructor(Instructor instructor){
        List<PracticalExam> practicalExams = practicalExamRepository.findByInstructor(instructor);
        List<PracticalExamDTO> practicalExamDTOs = new ArrayList<>();
        for (PracticalExam practicalExam : practicalExams) {
            practicalExamDTOs.add(new PracticalExamDTO(practicalExam));
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
        Instructor instructor = instructorService.findByEmail(createExamDTO.getInstructor_email());

        PracticalExam practicalExam = new PracticalExam();
        practicalExam.setCandidate(candidate);
        practicalExam.setInstructor(instructor);
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
