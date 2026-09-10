package com.example.carschool.util;

import com.example.carschool.model.NotificationType;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

@Component
public class NotificationUtil {

    private static final Map<NotificationType, String> TITLES = new EnumMap<>(NotificationType.class);
    static {
        TITLES.put(NotificationType.CLASS_SCHEDULED, "Class scheduled");
        TITLES.put(NotificationType.CLASS_CANCELLED, "Class cancelled");
        TITLES.put(NotificationType.CLASS_REQUEST_ACCEPTED, "Request accepted");
        TITLES.put(NotificationType.CLASS_REQUEST_DENIED, "Request denied");
        TITLES.put(NotificationType.LAST_CLASS_REMINDER, "Last class reminder");
        TITLES.put(NotificationType.INSTRUCTOR_ON_LEAVE, "Instructor on leave");
        TITLES.put(NotificationType.EXAM_SCHEDULED, "Exam scheduled");

        TITLES.put(NotificationType.CLASS_CANCELLED_BY_CANDIDATE, "Class cancelled");
        TITLES.put(NotificationType.NEW_CLASS_REQUEST, "New class request");
        TITLES.put(NotificationType.WEEKLY_SCHEDULE_REMINDER, "Weekly schedule reminder");
        TITLES.put(NotificationType.CAR_FIXED, "Vehicle fixed");
        TITLES.put(NotificationType.INSTRUCTOR_VEHICLE_REQUEST_ACCEPTED, "Vehicle request accepted");
        TITLES.put(NotificationType.INSTRUCTOR_VEHICLE_REQUEST_DENIED, "Vehicle request denied");
        TITLES.put(NotificationType.INSTRUCTOR_LEAVE_REQUEST_ACCEPTED, "Leave request accepted");
        TITLES.put(NotificationType.INSTRUCTOR_LEAVE_REQUEST_DENIED, "Leave request denied");
    }



    private static final Map<NotificationType, String> BODIES = new EnumMap<>(NotificationType.class);
    static {
        BODIES.put(NotificationType.CLASS_SCHEDULED, "Your class on %s with %s has been scheduled");
        BODIES.put(NotificationType.CLASS_CANCELLED, "Your class on %s was cancelled by your instructor");
        BODIES.put(NotificationType.CLASS_REQUEST_ACCEPTED, "Your request for a class on %s was accepted");
        BODIES.put(NotificationType.CLASS_REQUEST_DENIED, "Your request for a class on %s was denied");
        BODIES.put(NotificationType.LAST_CLASS_REMINDER, "Your class on %s is your last class");
        BODIES.put(NotificationType.INSTRUCTOR_ON_LEAVE, "Your instructor is on leave from %s to %s, you won't have classes this week");
        BODIES.put(NotificationType.EXAM_SCHEDULED, "Your exam has been scheduled for %s");

        BODIES.put(NotificationType.CLASS_CANCELLED_BY_CANDIDATE, "Your class on %s was cancelled by the candidate");
        BODIES.put(NotificationType.NEW_CLASS_REQUEST, "You have a new class request for %s");
        BODIES.put(NotificationType.WEEKLY_SCHEDULE_REMINDER, "Don't forget to schedule your classes for next week");
        BODIES.put(NotificationType.CAR_FIXED, "Your vehicle has been fixed and is ready for use");
        BODIES.put(NotificationType.INSTRUCTOR_VEHICLE_REQUEST_ACCEPTED, "Your vehicle request has been accepted");
        BODIES.put(NotificationType.INSTRUCTOR_VEHICLE_REQUEST_DENIED, "Your vehicle request has been denied");
        BODIES.put(NotificationType.INSTRUCTOR_LEAVE_REQUEST_ACCEPTED, "Your leave request has been accepted");
        BODIES.put(NotificationType.INSTRUCTOR_LEAVE_REQUEST_DENIED, "Your leave request has been denied");
    }


    public String title(NotificationType type) {
        return TITLES.get(type);
    }

    public String body(NotificationType type, Object... args) {
        String template = BODIES.get(type);
        return String.format(template, args);
    }





}
