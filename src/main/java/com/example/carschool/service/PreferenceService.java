package com.example.carschool.service;

import com.example.carschool.dto.CandidatePreferencesDTO;
import com.example.carschool.dto.TimePrefDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.CandidateRepository;
import com.example.carschool.repo.PreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class PreferenceService {

    @Autowired
    private PreferenceRepository preferenceRepository;
    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private CandidateService candidateService;



    public CandidatePreferencesDTO getCandidatePreference(Candidate candidate) {
        LocalDate nextWeekStart = LocalDate.now().with(DayOfWeek.MONDAY).plusWeeks(1);
        Preference pref =  preferenceRepository.findByCandidateAndWeekStartDate(candidate,nextWeekStart);

        CandidatePreferencesDTO dto =  new CandidatePreferencesDTO();
        dto.setCandidateEmail(candidate.getEmail());
        dto.setName(candidate.getName() + " " + candidate.getLastname());

        List<TimePrefDTO> timeDto = new ArrayList<>();

        for(TimePreference tp : pref.getTimePreferences()){
            timeDto.add(new TimePrefDTO(tp));
        }

        dto.setPrefDTOList(timeDto);
        return dto;

    }


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


    @Scheduled(cron = "0 0 20 * * SAT")
    public void rollOverPreferences() {


        LocalDate nextWeekStart = LocalDate.now().with(DayOfWeek.MONDAY).plusWeeks(1);

        for (Candidate c : candidateRepository.findByStatus(TrainingStatus.PRACTICAL)) {
            if (preferenceRepository.existsByCandidateAndWeekStartDate(c, nextWeekStart)) {
                continue;
            }

            Preference last = preferenceRepository.findTopByCandidateOrderByWeekStartDateDesc(c);

            Preference next = new Preference();
            next.setCandidate(c);
            next.setWeekStartDate(nextWeekStart);
            next.setCreatedAt(LocalDateTime.now());

            boolean hasPrevious = last != null;

            if (hasPrevious && last.getStatus() != PreferenceStatus.NO_PREFERENCE) {
                next.setStatus(PreferenceStatus.CARRIED_OVER);


                for (TimePreference tp : last.getTimePreferences()) {
                    TimePreference clone = new TimePreference();
                    clone.setDate(tp.getDate().plusDays(7));
                    clone.setStartTime(tp.getStartTime());
                    clone.setEndTime(tp.getEndTime());
                    clone.setPreference(next);
                    next.getTimePreferences().add(clone);
                }
            } else {
                next.setStatus(PreferenceStatus.NO_PREFERENCE);
            }

            preferenceRepository.save(next);
        }
    }


    @Transactional
    public void save(CandidatePreferencesDTO dto) {

        LocalDate nextWeekStart = LocalDate.now().with(DayOfWeek.MONDAY).plusWeeks(1);


        List<TimePrefDTO> timePrefDTOS = dto.getPrefDTOList();
        List<TimePreference> timePreferences = new ArrayList<>();

        Preference preference = new Preference();
        preference.setCandidate(candidateService.getByEmail(dto.getCandidateEmail()));
        preference.setStatus(PreferenceStatus.SUBMITTED);
        preference.setCreatedAt(LocalDateTime.now());
        preference.setWeekStartDate(nextWeekStart);
        Preference newPref = preferenceRepository.save(preference);

        for(TimePrefDTO tp : timePrefDTOS) {
            TimePreference clone = new TimePreference();
            clone.setDate(tp.getDate());
            clone.setStartTime(tp.getStartTime());
            clone.setEndTime(tp.getEndTime());
            clone.setPreference(newPref);
            timePreferences.add(clone);
        }

        newPref.setTimePreferences(timePreferences);
        preferenceRepository.save(newPref);

    }

    @Transactional
    public void updateTimePreferences(CandidatePreferencesDTO dto) {

        LocalDate nextWeekStart = LocalDate.now().with(DayOfWeek.MONDAY).plusWeeks(1);
        Candidate candidate = candidateService.getByEmail(dto.getCandidateEmail());

        Preference preference = preferenceRepository
                .findByCandidateAndWeekStartDate(candidate, nextWeekStart);

        if (preference == null) {
              new IllegalStateException("No preference row exists for this week yet");
        }


        List<TimePrefDTO> timePrefDTOS = dto.getPrefDTOList();

        preference.getTimePreferences().clear(); // orphanRemoval=true → deletes old rows in DB
        for (TimePrefDTO tp : timePrefDTOS) {
            TimePreference clone = new TimePreference();
            clone.setDate(tp.getDate());
            clone.setStartTime(tp.getStartTime());
            clone.setEndTime(tp.getEndTime());
            clone.setPreference(preference);
            preference.getTimePreferences().add(clone);
        }

        preference.setStatus(timePrefDTOS.isEmpty()
                ? PreferenceStatus.NO_PREFERENCE
                : PreferenceStatus.SUBMITTED);

        preferenceRepository.save(preference);
    }


    public void addNoPreference(Candidate candidate) {
        LocalDate nextWeekStart = LocalDate.now().with(DayOfWeek.MONDAY).plusWeeks(1);
        Preference preference = new Preference();
        preference.setCandidate(candidate);
        preference.setStatus(PreferenceStatus.NO_PREFERENCE);
        preference.setCreatedAt(LocalDateTime.now());
        preference.setWeekStartDate(nextWeekStart);
        preferenceRepository.save(preference);

    }



}
