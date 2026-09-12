package com.example.carschool.controller;

import com.example.carschool.dto.NotificationDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Notification;
import com.example.carschool.model.User;
import com.example.carschool.service.CandidateService;
import com.example.carschool.service.NotificationService;
import com.example.carschool.service.UserService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notif")
public class NotificationController {


    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private UserService userService;


    @GetMapping("/getAll")
    public ResponseEntity<List<NotificationDTO>> getNotifications(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        User user = userService.findByEmail(email);


        return ResponseEntity.ok(notificationService.getByUser(user.getId()));
    }


}
