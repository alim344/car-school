package com.example.carschool.controller;

import com.example.carschool.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notif")
public class NotificationController {


    @Autowired
    private NotificationService notificationService;


}
