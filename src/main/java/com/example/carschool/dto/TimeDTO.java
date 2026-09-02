package com.example.carschool.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class TimeDTO {
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime dateTime;

    public TimeDTO(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public TimeDTO() {
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public LocalDateTime getStartTime() {
        return dateTime;
    }

    public void setStartTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

}
