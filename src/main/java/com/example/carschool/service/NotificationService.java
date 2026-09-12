package com.example.carschool.service;

import com.example.carschool.dto.NotificationDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.Notification;
import com.example.carschool.model.NotificationType;
import com.example.carschool.repo.NotificationRepository;
import com.example.carschool.util.NotificationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationUtil notificationUtil;
    @Autowired
    private CandidateService candidateService;


    public void createNotification(NotificationType notificationType, Long objectId, Long userId,Object... args){

        Notification notification = new Notification();
        notification.setType(notificationType);
        notification.setObject_id(objectId);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setBody(notificationUtil.body(notificationType,args));
        notification.setTitle(notificationUtil.title(notificationType));
        notification.setRecipientId(userId);
        notificationRepository.save(notification);

    }


    public void notifyInstructorCandidates(Instructor instructor, LocalDate leaveStart, LocalDate leaveEnd){

      List<Candidate> candidateList = candidateService.getActiveCandidatesByInstructor(instructor);
      for(Candidate candidate : candidateList){
          createNotification(NotificationType.INSTRUCTOR_ON_LEAVE,null,candidate.getId(),leaveStart.toString(),leaveEnd.toString());
      }

    }


    public List<NotificationDTO> getByCandidate(Long userId) {
        List<Notification> notificationList = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        return notificationList.stream().map(NotificationDTO::new).toList();
    }


}
