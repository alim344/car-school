package com.example.carschool.repo;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.InstructorChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstructorChangeRequestRepository extends JpaRepository<InstructorChangeRequest, Long> {

    List<InstructorChangeRequest> findByCandidate(Candidate candidate);


}
