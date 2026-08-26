package com.example.carschool.service;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.repo.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    public List<Candidate> getByInstructor(Instructor instructor) {
        return candidateRepository.findByInstructor(instructor);
    }

    public Candidate getByEmail(String email) {
        return candidateRepository.findByEmail(email);
    }

}
