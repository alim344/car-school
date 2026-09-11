package com.example.carschool.dto;

import com.example.carschool.model.Notification;
import com.example.carschool.model.NotificationType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class NotificationDTO {

    private Long id;

    private NotificationType type;

    private String title;

    private String body;

    private Long objectId;

    public NotificationDTO() {}

    public NotificationDTO(Notification notification){
        this.id = notification.getId();
        this.type = notification.getType();
        this.title = notification.getTitle();
        this.body = notification.getBody();
        this.objectId = notification.getObject_id();
    }
}
