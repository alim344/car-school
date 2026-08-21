package com.example.carschool.repo;

import com.example.carschool.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Long> {


    @Query("SELECT r FROM Route r WHERE r.id NOT IN (" +
            "  SELECT pc.route.id FROM PracticalClass pc " +
            "  WHERE pc.candidate.email = :candidateEmail " +
            "    AND pc.route.id IS NOT NULL " +
            "    AND pc.classStatus = com.example.carschool.model.ClassStatus.ENDED" +
            ")")
    List<Route> findUnvisitedRoutesForCandidate(@Param("candidateEmail") String candidateEmail);





}
