package com.example.carschool.repo;

import com.example.carschool.model.Admin;
import com.example.carschool.model.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Admin findByEmail(String email);


    @Query("SELECT a FROM Admin a WHERE a.id NOT IN (" +
            "  SELECT pe.admin.id FROM PracticalExam pe " +
            "  WHERE pe.dateTime = :dateTime " +
            "  AND pe.status != :cancelledStatus" +
            ")")
    List<Admin> findAvailableAdminsAt(
            @Param("dateTime") LocalDateTime dateTime,
            @Param("cancelledStatus") ExamStatus cancelledStatus
    );


    @Query("SELECT a FROM Admin a WHERE a.id NOT IN (" +
            "  SELECT pe.admin.id FROM PracticalExam pe " +
            "  WHERE pe.dateTime >= :startTime AND pe.dateTime < :endTime " +
            "  AND pe.status != :cancelledStatus" +
            ")")
    List<Admin> findAvailableAdminsBetween(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("cancelledStatus") ExamStatus cancelledStatus
    );



}
