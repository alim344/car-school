package com.example.carschool.service;

import com.example.carschool.model.Notification;
import com.example.carschool.model.NotificationType;
import com.example.carschool.repo.NotificationRepository;
import com.example.carschool.util.NotificationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationUtil notificationUtil;


    public void createNotification(NotificationType notificationType, Long objectId, Long userId){

        Notification notification = new Notification();
        notification.setType(notificationType);
        notification.setObject_id(objectId);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setBody(notificationUtil.body(notificationType));
        notification.setTitle(notificationUtil.title(notificationType));
        notification.setRecipientId(userId);
        notificationRepository.save(notification);

    }


}
