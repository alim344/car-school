package com.example.carschool.dto;

import com.example.carschool.model.PreferenceStatus;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CandidatePreferencesDTO {

    private String name;
    private String candidateEmail;
    private PreferenceStatus status;

    private List<TimePrefDTO> prefDTOList = new ArrayList<>();

    public CandidatePreferencesDTO() {
    }
}
