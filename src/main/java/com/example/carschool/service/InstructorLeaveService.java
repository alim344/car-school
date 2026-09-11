package com.example.carschool.service;

import com.example.carschool.dto.AdminLeaveResponseDTO;
import com.example.carschool.dto.LeaveRequestDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.InstructorLeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class InstructorLeaveService {

    @Autowired
    private InstructorLeaveRequestRepository leaveRequestRepository;
    @Autowired
    private PracticalClassService practicalClassService;
    @Autowired
    private NotificationService notificationService;


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

    public List<LeaveRequestDTO> getLeaveRequestsByInstructor(Instructor instructor) {
        List<InstructorLeaveRequest> requests =  leaveRequestRepository.findByInstructor(instructor);
        return requests.stream().map(LeaveRequestDTO::new).toList();
    }



    public void createLeaveRequest(LeaveRequestDTO leaveRequestDTO, Instructor instructor) {

        checkLeaveLimit(leaveRequestDTO.getStartDate(),leaveRequestDTO.getEndDate(), instructor);

        InstructorLeaveRequest leaveRequest = new InstructorLeaveRequest();
        leaveRequest.setStartDate(leaveRequestDTO.getStartDate());
        leaveRequest.setEndDate(leaveRequestDTO.getEndDate());
        leaveRequest.setRequestedAt(LocalDateTime.now());
        leaveRequest.setStatus(LeaveStatus.PENDING);
        leaveRequest.setType(leaveRequestDTO.getType());
        leaveRequest.setReason(leaveRequestDTO.getReason());
        leaveRequest.setInstructor(instructor);
        leaveRequestRepository.save(leaveRequest);


    }

    private void checkLeaveLimit(LocalDate startTime, LocalDate endTime , Instructor instructor) {
        long requestedDays = ChronoUnit.DAYS.between(startTime, endTime) + 1;
        int year = startTime.getYear();
        int remaining = getRemainingLeaveDays(instructor);

        if (requestedDays > remaining) {
            throw new IllegalArgumentException(
                    "This request needs " + requestedDays + " days, but only "
                            + remaining + " remain for " + year + "."
            );
        }
    }


    @Transactional
    public void handleRequest( AdminLeaveResponseDTO dto){

        InstructorLeaveRequest request = leaveRequestRepository.findById(dto.getId()).orElse(null);
        if(request == null){
            throw new IllegalArgumentException("invalid request");
        }

        if(dto.isAccepted()){
            practicalClassService.cancelClasses(request.getStartDate().atTime(0 ,0),request.getEndDate().atTime(0 ,0));
            checkLeaveLimit(request.getStartDate(), request.getEndDate(), request.getInstructor());
            request.setStatus(LeaveStatus.APPROVED);
            if(request.getType() == LeaveType.SICK ){
                notificationService.notifyInstructorCandidates(request.getInstructor(), request.getStartDate(), request.getEndDate());
            }

        }else{
            request.setStatus(LeaveStatus.REJECTED);
        }

        request.setAdminComment(dto.getResponse());
        request.setResolvedAt(LocalDateTime.now());
        leaveRequestRepository.save(request);

    }


    public List<LeaveRequestDTO> getAllLeaveRequests() {
        return leaveRequestRepository.findAllByOrderByRequestedAtDesc().stream()
                .map(request -> {
                    int remainingDays = getRemainingLeaveDays(request.getInstructor());
                    return new LeaveRequestDTO(request, remainingDays);
                })
                .toList();

    }




    public int getUsedLeaveDays(Instructor instructor) {


        int currentYear = LocalDate.now().getYear();
        List<InstructorLeaveRequest> requests = leaveRequestRepository.findByInstructorAndStartDateBetween(instructor,
                LocalDate.of(currentYear,1,1), LocalDate.of(currentYear,12,31));


        int totalDays = 0;
        for(InstructorLeaveRequest request : requests){
            if(request.getStatus() == LeaveStatus.APPROVED || request.getStatus() == LeaveStatus.USED){

                totalDays += (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

            }
        }
        return totalDays;

    }


     public int getRemainingLeaveDays(Instructor instructor) {
        int currentYear = LocalDate.now().getYear();
        return instructor.getAnnualLeaveAllowance() - getUsedLeaveDays(instructor);
     }






}
