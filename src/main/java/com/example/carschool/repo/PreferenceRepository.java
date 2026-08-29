package com.example.carschool.repo;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PreferenceRepository extends JpaRepository<Preference, Long> {

    @Query("""
        SELECT DISTINCT p FROM Preference p
        JOIN FETCH p.timePreferences tp
        JOIN FETCH p.candidate c
        WHERE c.instructor.id = :instructorId
        AND tp.date BETWEEN :startDate AND :endDate
        ORDER BY c.id, tp.date, tp.startTime
    """)
    List<Preference> findByInstructorAndDateRange(
            @Param("instructorId") Long instructorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );


    boolean existsByCandidateAndWeekStartDate(Candidate candidate, LocalDate startDate);

    Preference findTopByCandidateOrderByWeekStartDateDesc(Candidate candidate);


    Preference findByCandidateAndWeekStartDate(Candidate candidate, LocalDate startDate);

}




