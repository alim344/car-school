package com.example.carschool.repo;

import com.example.carschool.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticalExamRepository extends JpaRepository<PracticalExam, Long> {

    List<PracticalExam> findByCandidate(Candidate candidate);
    List<PracticalExam> findByStatus(ExamStatus status);
    List<PracticalExam> findByAdmin(Admin admin);
}
