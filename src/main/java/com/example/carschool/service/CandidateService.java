package com.example.carschool.service;

import com.example.carschool.repo.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

}
