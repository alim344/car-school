package com.example.carschool.repo;

import com.example.carschool.model.Instructor;
import com.example.carschool.model.PracticalClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PracticalClassRepository extends JpaRepository<PracticalClass, Long> {

    List<PracticalClass> findByInstructor(Instructor instructor);

    List<PracticalClass> findByInstructorAndScheduledStartTimeBetween(Instructor instructor, LocalDateTime startOfDay, LocalDateTime endOfDay);

    boolean existsByInstructorAndScheduledStartTimeLessThanAndScheduledEndTimeGreaterThan(
            Instructor instructor,
            LocalDateTime endTime,
            LocalDateTime startTime
    );


}