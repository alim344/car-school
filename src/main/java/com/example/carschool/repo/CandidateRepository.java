package com.example.carschool.repo;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.TrainingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {


    List<Candidate> findByInstructor(Instructor instructor);

    Candidate findByEmail(String email);

    List<Candidate> findByInstructorAndStatus(Instructor instructor, TrainingStatus status);

    List<Candidate> findByStatus(TrainingStatus status);

    long countByInstructor(Instructor instructor);

}
