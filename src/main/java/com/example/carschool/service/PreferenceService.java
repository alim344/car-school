package com.example.carschool.service;

import com.example.carschool.dto.CandidatePreferencesDTO;
import com.example.carschool.dto.TimePrefDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.Preference;
import com.example.carschool.repo.PreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class PreferenceService {

    @Autowired
    private PreferenceRepository preferenceRepository;



    public List<CandidatePreferencesDTO> getWeeklyPreferencesByInstructor(Long instructorId) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
        LocalDate weekEnd = weekStart.plusDays(6);
        List<Preference> preferences = preferenceRepository
                .findByInstructorAndDateRange(instructorId, weekStart, weekEnd);

        return preferences.stream()
                .collect(Collectors.groupingBy(Preference::getCandidate))
                .entrySet().stream()
                .map(entry -> {
                    Candidate candidate = entry.getKey();
                    List<Preference> candidatePrefs = entry.getValue();

                    CandidatePreferencesDTO dto = new CandidatePreferencesDTO();
                    dto.setCandidateEmail(candidate.getEmail());
                    dto.setName(candidate.getName()+" "+candidate.getLastname());

                    List<TimePrefDTO> timePrefDTOs = candidatePrefs.stream()
                            .flatMap(pref -> pref.getTimePreferences().stream())
                            .map(TimePrefDTO::new)
                            .collect(Collectors.toList());

                    dto.setPrefDTOList(timePrefDTOs);
                    return dto;
                })
                .collect(Collectors.toList());
    }





}
