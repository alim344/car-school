package com.example.carschool.service;

import com.example.carschool.dto.ClassRequestDTO;
import com.example.carschool.model.ClassRequest;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.NotificationType;
import com.example.carschool.repo.ClassRequestRepository;
import com.example.carschool.util.NotificationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ClassRequestService {

    @Autowired
    private ClassRequestRepository classRequestRepository;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private NotificationUtil notificationUtil;


    public List<ClassRequestDTO> getInstructorRequests(Instructor instructor) {
        List<ClassRequest> requests = classRequestRepository.findByInstructor(instructor);

        List<ClassRequestDTO> instructorRequests = new ArrayList<>();

        for (ClassRequest request : requests) {
            instructorRequests.add(new ClassRequestDTO(request));
        }
        return instructorRequests;

    }

    public void deleteRequest(Long requestId) {
        ClassRequest request = classRequestRepository.findById(requestId).get();

        LocalDateTime requestDateTime = LocalDateTime.of(request.getDate(), request.getStartTime());
        String formattedDate = notificationUtil.formatDateTime(requestDateTime);

        notificationService.createNotification(NotificationType.CLASS_REQUEST_DENIED,null,request.getCandidate().getId(),formattedDate);
       classRequestRepository.deleteById(requestId);
    }

    public Integer getNumberOfClassRequests(Instructor instructor) {
        return classRequestRepository.findByInstructor(instructor).size();
    }


}
