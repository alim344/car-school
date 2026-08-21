package com.example.carschool.dto;

import com.example.carschool.model.PracticalClass;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class InstructorDashboardDTO {

    private Integer studentsNum;
    private Integer todayClassesNum;
    private Integer requestNum;

    List<PracticalClassDTO> todayClasses;

    public InstructorDashboardDTO() {}


}
