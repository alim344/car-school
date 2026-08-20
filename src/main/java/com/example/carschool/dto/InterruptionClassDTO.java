package com.example.carschool.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class InterruptionClassDTO {

    private Long classId;
    private String reason;
    private String note;

    public InterruptionClassDTO() {}
    public InterruptionClassDTO(Long id,String reason, String note) {
        this.classId = id;
        this.reason = reason;
        this.note = note;
    }

}
