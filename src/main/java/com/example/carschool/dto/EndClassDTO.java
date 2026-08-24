package com.example.carschool.dto;

import lombok.*;

@Getter
@Setter
public class EndClassDTO {

    private Long id;
    private Integer grade;
    private String comment;
    private String remarks;
    private Long routeId;

    public EndClassDTO() {}
    public EndClassDTO(Long id, Integer grade, String comment, String remarks,Long routeId) {
        this.id = id;
        this.grade = grade;
        this.comment = comment;
        this.remarks = remarks;
        this.routeId = routeId;
    }

}
