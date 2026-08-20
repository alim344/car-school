package com.example.carschool.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LocationNoteDTO {


    private Long classId;
    private double latitude;
    private double longitude;
    private String note;

    public LocationNoteDTO() {
    }
    public LocationNoteDTO(Long classId, double latitude, double longitude, String note) {
        this.classId = classId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.note = note;

    }
}
