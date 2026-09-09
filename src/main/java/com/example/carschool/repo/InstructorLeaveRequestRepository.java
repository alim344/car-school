package com.example.carschool.repo;

import com.example.carschool.model.Instructor;
import com.example.carschool.model.InstructorLeaveRequest;
import com.example.carschool.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface InstructorLeaveRequestRepository extends JpaRepository<InstructorLeaveRequest, Long> {


    List<InstructorLeaveRequest> findByInstructor(Instructor instructor);

    List<InstructorLeaveRequest> findByInstructorAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(Instructor instructor, LeaveStatus status, LocalDate startDate, LocalDate endDate);

    boolean existsByInstructorAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(Instructor instructor, LeaveStatus status, LocalDate startDate, LocalDate endDate);
}
