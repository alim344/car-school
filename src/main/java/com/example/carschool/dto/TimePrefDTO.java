package com.example.carschool.dto;

import com.example.carschool.model.TimePreference;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class TimePrefDTO {


    private Long id;

    private LocalDate date;

    private LocalTime startTime;
    private LocalTime endTime;

    private String location;


    public TimePrefDTO() {
    }

    public TimePrefDTO(TimePreference timePreference) {
        this.id = timePreference.getId();
        this.date = timePreference.getDate();
        this.startTime = timePreference.getStartTime();
        this.endTime = timePreference.getEndTime();
    }
}
