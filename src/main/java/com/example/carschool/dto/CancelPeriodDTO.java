package com.example.carschool.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CancelPeriodDTO {


    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public CancelPeriodDTO() {
    }

    public CancelPeriodDTO(LocalDateTime startTime, LocalDateTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
