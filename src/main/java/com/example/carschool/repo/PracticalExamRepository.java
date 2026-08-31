package com.example.carschool.repo;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.ExamStatus;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.PracticalExam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticalExamRepository extends JpaRepository<PracticalExam, Long> {

    List<PracticalExam> findByInstructor(Instructor instructor);
    List<PracticalExam> findByCandidate(Candidate candidate);
    List<PracticalExam> findByStatus(ExamStatus status);
}
