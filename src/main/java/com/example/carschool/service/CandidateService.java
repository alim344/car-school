package com.example.carschool.service;

import com.example.carschool.dto.CandidateDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.TrainingStatus;
import com.example.carschool.repo.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    public List<Candidate> getByInstructor(Instructor instructor) {
        return candidateRepository.findByInstructor(instructor);
    }

    public List<Candidate> getActiveCandidatesByInstructor(Instructor instructor) {
        return candidateRepository.findByInstructorAndStatus(instructor, TrainingStatus.PRACTICAL);
    }


    public List<Candidate> getActiveCandidates(){
        return candidateRepository.findByStatus(TrainingStatus.PRACTICAL);
    }



    public Candidate getByEmail(String email) {
        return candidateRepository.findByEmail(email);
    }


    public List<CandidateDTO> getNameByInstructor(Instructor instructor) {
        List<Candidate> candidateList = getActiveCandidatesByInstructor(instructor);
        List<CandidateDTO> dtos = new ArrayList<>();
        for(Candidate candidate : candidateList) {
            dtos.add(new CandidateDTO(candidate));
        }
        return dtos;

    }

}
