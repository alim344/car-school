package com.example.carschool.repo;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.PracticalClass;
import com.example.carschool.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PracticalClassRepository extends JpaRepository<PracticalClass, Long> {

    List<PracticalClass> findByInstructor(Instructor instructor);
    List<PracticalClass> findByCandidate(Candidate candidate);

    List<PracticalClass> findByInstructorAndScheduledStartTimeBetween(Instructor instructor, LocalDateTime startOfDay, LocalDateTime endOfDay);

    boolean existsByInstructorAndScheduledStartTimeLessThanAndScheduledEndTimeGreaterThan(
            Instructor instructor,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    List<PracticalClass> findByInstructorAndScheduledStartTimeLessThanAndScheduledEndTimeGreaterThan(
            Instructor instructor,
            LocalDateTime endTime,
            LocalDateTime startTime
    );


    List<PracticalClass> findByScheduledStartTimeBetween( LocalDateTime startOfDay, LocalDateTime endOfDay);


    List<PracticalClass> findByCandidateOrderByScheduledStartTimeDesc(Candidate candidate);



}