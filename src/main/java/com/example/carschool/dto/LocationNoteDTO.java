package com.example.carschool.dto;

import com.example.carschool.model.LocationNote;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LocationNoteDTO {

    private Long id;
    private Long classId;
    private double latitude;
    private double longitude;
    private String note;

    public LocationNoteDTO() {
    }

    public LocationNoteDTO(Long id,Long classId, double latitude, double longitude, String note) {
        this.classId = classId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.note = note;
        this.id = id;

    }


    public LocationNoteDTO(LocationNote note) {
        this.id = note.getId();
        this.latitude = note.getLatitude();
        this.longitude = note.getLongitude();
        this.note = note.getNote();
        this.classId = note.getPracticalClass().getId();

    }
}
