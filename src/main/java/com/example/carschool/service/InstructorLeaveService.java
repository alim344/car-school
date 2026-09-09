package com.example.carschool.service;

import com.example.carschool.model.Instructor;
import com.example.carschool.model.InstructorLeaveRequest;
import com.example.carschool.model.LeaveStatus;
import com.example.carschool.repo.InstructorLeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class InstructorLeaveService {

    @Autowired
    private InstructorLeaveRequestRepository leaveRequestRepository;



    public boolean isOnLeave(Instructor instructor, LocalDate date) {
        return leaveRequestRepository.existsByInstructorAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                instructor, LeaveStatus.APPROVED, date, date
        );
    }

    public Set<LocalDate> getLeaveDatesInRange(Instructor instructor, LocalDate rangeStart, LocalDate rangeEnd) {
        List<InstructorLeaveRequest> leaves = leaveRequestRepository
                .findByInstructorAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        instructor, LeaveStatus.APPROVED, rangeEnd, rangeStart
                );

        Set<LocalDate> leaveDates = new HashSet<>();
        for (InstructorLeaveRequest leave : leaves) {
            LocalDate d = leave.getStartDate().isBefore(rangeStart) ? rangeStart : leave.getStartDate();
            LocalDate end = leave.getEndDate().isAfter(rangeEnd) ? rangeEnd : leave.getEndDate();
            while (!d.isAfter(end)) {
                leaveDates.add(d);
                d = d.plusDays(1);
            }
        }
        return leaveDates;
    }



}
