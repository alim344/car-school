package com.example.carschool.dto;

import com.example.carschool.model.Candidate;
import com.example.carschool.model.PracticalClass;
import com.example.carschool.model.Preference;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
public class AlgScheduleDTO {


    private DayOfWeek fullDayOff;
    private List<DayOfWeek> lightDays; // 2 max
    List<String> candidate_emails = new ArrayList<>();

    public AlgScheduleDTO(){}

}
