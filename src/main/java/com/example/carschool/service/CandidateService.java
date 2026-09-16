package com.example.carschool.service;

import com.example.carschool.dto.CandidateDTO;
import com.example.carschool.dto.InstructorChangeRequestDTO;
import com.example.carschool.dto.InstructorDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.CandidateRepository;
import com.example.carschool.repo.InstructorChangeRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private InstructorChangeRequestRepository instructorChangeRequestRepository;


    public List<Candidate> getByInstructor(Instructor instructor) {
        return candidateRepository.findByInstructor(instructor);
    }

    public Candidate getById(Long id) {
        return candidateRepository.findById(id).orElse(null);
    }


    public List<CandidateDTO> getAllDtoByInstructor(Instructor instructor) {
        List<Candidate> candidates = getByInstructor(instructor);
        return candidates.stream().map(CandidateDTO::new).toList();
    }

    public List<Candidate> getActiveCandidatesByInstructor(Instructor instructor) {
        return candidateRepository.findByInstructorAndStatus(instructor, TrainingStatus.PRACTICAL);
    }


    public List<Candidate> getCandidatesByStatus(TrainingStatus status){
        return candidateRepository.findByStatus(status);
    }

    public void save(Candidate candidate) {
        candidateRepository.save(candidate);
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

    public List<CandidateDTO> getPendingCandidates(){
        List<Candidate> candidates = getCandidatesByStatus(TrainingStatus.PENDING);
        List<CandidateDTO> dtos = new ArrayList<>();
        for(Candidate candidate : candidates) {
            dtos.add(new CandidateDTO(candidate));

        }
        return dtos;
    }

    public List<Candidate> getCandidatesByEmail(List<String> emails) {

        List<Candidate> candidates = new ArrayList<>();
        for(String email : emails) {
            candidates.add(getByEmail(email));

        }
        return candidates;
    }


    public List<InstructorChangeRequestDTO> getAllChangeRequests(){
        List<InstructorChangeRequest> requests = instructorChangeRequestRepository.findAll();
        return requests.stream().map(InstructorChangeRequestDTO::new).toList();
    }


    public InstructorChangeRequestDTO getRequestsByCandidate(Candidate candidate){
        return new InstructorChangeRequestDTO(instructorChangeRequestRepository.findTopByCandidateOrderByDateDesc(candidate));
    }


    public void createChangeRequest(InstructorChangeRequestDTO dto,Candidate candidate, Instructor instructor) {
        InstructorChangeRequest request = new InstructorChangeRequest();
        request.setCandidate(candidate);
        request.setStatus(CarRequestStatus.PENDING);
        request.setInstructor(instructor);
        request.setReason(dto.getReason());
        instructorChangeRequestRepository.save(request);
    }


    @Transactional
    public void acceptRequest(Long id){
        InstructorChangeRequest instructorChangeRequest = instructorChangeRequestRepository.findById(id).orElse(null);
        if(instructorChangeRequest == null){
            throw new IllegalArgumentException("Request doesnt exist");
        }
        instructorChangeRequest.setStatus(CarRequestStatus.ACCEPTED);
        Candidate candidate = instructorChangeRequest.getCandidate();
        candidate.setStatus(TrainingStatus.WAITING_FOR_INSTRUCTOR);
        candidateRepository.save(candidate);
        instructorChangeRequestRepository.save(instructorChangeRequest);
    }

    public void declineRequest(Long id){
        InstructorChangeRequest instructorChangeRequest = instructorChangeRequestRepository.findById(id).orElse(null);
        if(instructorChangeRequest == null){
            throw new IllegalArgumentException("Request doesnt exist");
        }
        instructorChangeRequest.setStatus(CarRequestStatus.DECLINED);
        instructorChangeRequestRepository.save(instructorChangeRequest);
    }

    public long countByInstructor(Instructor instructor){
        return candidateRepository.countByInstructorAndStatus(instructor,TrainingStatus.PRACTICAL);
    }

    public void assignInstructor(List<String> candidateEmails, Instructor instructor){


        for(String email : candidateEmails){
            Candidate candidate = getByEmail(email);
            if(candidate.getCategory() != instructor.getCategory()){
                throw new IllegalArgumentException("Categories dont match");
            }
            candidate.setInstructor(instructor);
            candidate.setStatus(TrainingStatus.PRACTICAL);

            candidateRepository.save(candidate);
        }
    }

    public void freeCandidates(List<String> emails){

        for(String email : emails){
            Candidate candidate = getByEmail(email);
            candidate.setStatus(TrainingStatus.WAITING_FOR_INSTRUCTOR);
            candidateRepository.save(candidate);
        }
    }

    public List<CandidateDTO> getALl(){
        return candidateRepository.findAll().stream().map(CandidateDTO::new).toList();
    }


}
