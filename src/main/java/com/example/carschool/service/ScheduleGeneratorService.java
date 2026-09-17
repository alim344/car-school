package com.example.carschool.service;

import com.example.carschool.dto.AlgScheduleDTO;
import com.example.carschool.dto.CreateClassDTO;

import com.example.carschool.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class ScheduleGeneratorService {

    @Autowired
    private PracticalClassService practicalClassService;
    @Autowired
    private PreferenceService preferenceService;

    @Autowired
    private InstructorLeaveService instructorLeaveService;

    public List<CreateClassDTO> generateDraftSchedule(
            Instructor instructor,
            LocalDate weekStartDate,
            AlgScheduleDTO algScheduleDTO,
            List<Candidate> candidates

    ) {
        List<Preference> preferences = getNextWeekPreferences(instructor.getId());
        List<PracticalClass> existingClassesForWeek = practicalClassService.getByInstructorAndWeek(instructor);
        List<CreateClassDTO> newlyGeneratedDrafts = new ArrayList<>();
        List<PracticalClass> allScheduledClasses = new ArrayList<>(existingClassesForWeek);


        //dobavljamo sick leaves ako ih ima
        Set<LocalDate> leaveDates = instructorLeaveService.getLeaveDatesInRange(
                instructor, weekStartDate, weekStartDate.plusDays(6)
        );

        Map<Long, Preference> candidatePrefMap = preferences.stream().collect(Collectors.toMap(p -> p.getCandidate().getId(), p -> p));

        //sortiramo kandidate

        List<Candidate> sortedCandidates = sortCandidatesByPriority(candidates, candidatePrefMap);


        //gledamo da li imaju casove od pre zakazzane za sledecu nedelju i dodajemo ih u mapu
        Map<Long, Integer> candidateClassCounts = new HashMap<>();
        for (Candidate c : candidates) {
            long count = existingClassesForWeek.stream()
                    .filter(pc -> pc.getCandidate().getId().equals(c.getId()))
                    .count();
            candidateClassCounts.put(c.getId(), (int) count);
        }

        // dodajemo kandidatima 1 cas

        for (Candidate candidate : sortedCandidates) {

            if (candidateClassCounts.get(candidate.getId()) < 1) {
                boolean scheduled = scheduleNextClassForCandidate(
                        candidate, instructor, candidatePrefMap.get(candidate.getId()),
                        allScheduledClasses, newlyGeneratedDrafts, weekStartDate, algScheduleDTO, leaveDates
                );
                if (scheduled) {
                    candidateClassCounts.put(candidate.getId(), 1);
                }
            }
        }


        for (Candidate candidate : sortedCandidates) {
            if (candidateClassCounts.get(candidate.getId()) < 2) {
                boolean scheduled = scheduleNextClassForCandidate(
                        candidate, instructor, candidatePrefMap.get(candidate.getId()),
                        allScheduledClasses, newlyGeneratedDrafts, weekStartDate,algScheduleDTO,leaveDates
                );
                if (scheduled) {
                    candidateClassCounts.put(candidate.getId(), candidateClassCounts.get(candidate.getId()) + 1);
                }
            }
        }

        return newlyGeneratedDrafts;
    }

    private List<Preference> getNextWeekPreferences(Long instructorId){
        return preferenceService.getNextWeekInstructorPreferences(instructorId);
    }

    private boolean scheduleNextClassForCandidate(
            Candidate candidate,
            Instructor instructor,
            Preference preference,
            List<PracticalClass> allScheduledClasses,
            List<CreateClassDTO> newlyGeneratedDrafts,
            LocalDate weekStartDate,
            AlgScheduleDTO algScheduleDTO,
            Set<LocalDate> leaveDates
    ) {


        List<TimePreference> timePrefs  = new ArrayList<>();
        if(preference != null && preference.getTimePreferences() != null) {
            timePrefs.addAll(preference.getTimePreferences());
        }

        //--------------------1. PRVI POKUSAJ - da svako dobije cas po svojoj preferenci
        for (TimePreference tp : timePrefs) {
            LocalDate date = tp.getDate();
            if (!isInstructorWorkingOnDate(date, algScheduleDTO, allScheduledClasses,leaveDates)) continue;
            if (candidateHasClassOnDate(candidate, date, allScheduledClasses)) continue;

            LocalDateTime candidateStartWindow = LocalDateTime.of(date, tp.getStartTime());
            LocalDateTime candidateEndWindow = LocalDateTime.of(date, tp.getEndTime());

            LocalDateTime validStart = findNextValidStartTimeInWindow(
                    candidateStartWindow, candidateEndWindow, allScheduledClasses);


            if (validStart != null) {
                createAndBookClass(candidate,  preference, validStart, newlyGeneratedDrafts, allScheduledClasses);
                return true;
            }
        }

        //ako nema nijedno slobodno mesto od zahtevanih onda pokusavamo da zakazemo sto blize preferencama
        LocalDateTime bestProximityStart = null;
        long globalMinDiffMinutes = Long.MAX_VALUE;

        for (TimePreference tp : timePrefs) {
            LocalDate date = tp.getDate();
            if (!isInstructorWorkingOnDate(date, algScheduleDTO, allScheduledClasses,leaveDates)) continue;
            if (candidateHasClassOnDate(candidate, date, allScheduledClasses)) continue;

            LocalTime time_start = LocalTime.of(7, 0);
            LocalTime time_end   = LocalTime.of(21, 0);

            LocalDateTime dayStart = date.atTime(time_start);
            LocalDateTime dayEnd   = date.atTime(time_end);



            LocalDateTime candidateStart = LocalDateTime.of(date, tp.getStartTime());

            LocalDateTime closestStartOnDay = findClosestValidStartTimeOnDay(
                    candidateStart, dayStart, dayEnd, allScheduledClasses
            );

            if (closestStartOnDay != null) {
                long diff = Math.abs(Duration.between(closestStartOnDay, candidateStart).toMinutes());
                if (diff < globalMinDiffMinutes) {
                    globalMinDiffMinutes = diff;
                    bestProximityStart = closestStartOnDay;
                }
            }
        }


        //ako je moguce dodamo taj cas
        if (bestProximityStart != null) {
            createAndBookClass(candidate,  preference, bestProximityStart, newlyGeneratedDrafts, allScheduledClasses);
            return true;
        }

        // ako nista od toga onda ga ubacujemo bilo gde
        for (int i = 0; i < 7; i++) {
            LocalDate date = weekStartDate.plusDays(i);
            if (!isInstructorWorkingOnDate(date, algScheduleDTO, allScheduledClasses,leaveDates)) continue;
            if (candidateHasClassOnDate(candidate, date, allScheduledClasses)) continue;

            LocalTime time_start = LocalTime.of(7, 0);
            LocalTime time_end   = LocalTime.of(21, 0);

            LocalDateTime dayStart = date.atTime(time_start);
            LocalDateTime dayEnd   = date.atTime(time_end);

            LocalDateTime validStart = findNextValidStartTimeInWindow(
                    dayStart, dayEnd, allScheduledClasses
            );

            if (validStart != null) {
                createAndBookClass(candidate, preference, validStart, newlyGeneratedDrafts, allScheduledClasses);
                return true;
            }
        }

        return false; //nikako ga ne moye ubaciti
    }

    private LocalDateTime findNextValidStartTimeInWindow(
            LocalDateTime windowStart,
            LocalDateTime windowEnd,
            List<PracticalClass> allScheduledClasses

    ) {
        int durationMinutes = 90;
        int stepMinutes = 15;

        LocalDateTime currentStart = windowStart;

        while (currentStart.plusMinutes(durationMinutes).isBefore(windowEnd) ||
                currentStart.plusMinutes(durationMinutes).isEqual(windowEnd)) {

            LocalDateTime currentEnd = currentStart.plusMinutes(durationMinutes);

            if (isSlotConflictFree(currentStart, currentEnd, allScheduledClasses)) {
                return currentStart;
            }

            currentStart = currentStart.plusMinutes(stepMinutes);
        }

        return null;
    }

    private LocalDateTime findClosestValidStartTimeOnDay(
            LocalDateTime preferredStart,
            LocalDateTime dayStart,
            LocalDateTime dayEnd,
            List<PracticalClass> allScheduledClasses
    ) {
        int durationMinutes = 90;
        int stepMinutes = 15;

        LocalDateTime currentStart = dayStart;
        LocalDateTime bestStart = null;
        long minDiffMinutes = 0;

        while (currentStart.plusMinutes(durationMinutes).isBefore(dayEnd) ||
                currentStart.plusMinutes(durationMinutes).isEqual(dayEnd)) {

            LocalDateTime currentEnd = currentStart.plusMinutes(durationMinutes);

            if (isSlotConflictFree(currentStart, currentEnd, allScheduledClasses)) {
                long diff = Math.abs(Duration.between(currentStart, preferredStart).toMinutes());
                if (diff < minDiffMinutes) {
                    minDiffMinutes = diff;
                    bestStart = currentStart;
                }
            }

            currentStart = currentStart.plusMinutes(stepMinutes);
        }

        return bestStart;
    }

    private boolean isSlotConflictFree(
            LocalDateTime start,
            LocalDateTime end,
            List<PracticalClass> allScheduledClasses
    ) {
        int buffer = 5;

        for (PracticalClass existing : allScheduledClasses) {
            LocalDateTime existingStartWithBuffer = existing.getScheduledStartTime().minusMinutes(buffer);
            LocalDateTime existingEndWithBuffer = existing.getScheduledEndTime().plusMinutes(buffer);

            if (start.isBefore(existingEndWithBuffer) && end.isAfter(existingStartWithBuffer)) {
                return false;
            }
        }
        return true;
    }

    private boolean isInstructorWorkingOnDate(
            LocalDate date,
            AlgScheduleDTO algScheduleDTO,
            List<PracticalClass> allScheduledClasses,
            Set<LocalDate> leaveDates
    ) {

        if (leaveDates.contains(date)) {
            return false;
        }
        DayOfWeek day = date.getDayOfWeek();

        if (algScheduleDTO.getFullDayOff() != null && algScheduleDTO.getFullDayOff() == day) {
            return false;
        }

        long classesOnDate = allScheduledClasses.stream()
                .filter(c -> c.getScheduledStartTime().toLocalDate().equals(date))
                .count();

        if (algScheduleDTO.getLightDays() != null && algScheduleDTO.getLightDays().contains(day)) {
            return classesOnDate < 2; // na lagane dane moze imati samo 2 casa
        }

        return classesOnDate < 5;
    }

    private boolean candidateHasClassOnDate(Candidate candidate, LocalDate date, List<PracticalClass> allClasses) {
        return allClasses.stream().anyMatch(c ->
                c.getCandidate().getId().equals(candidate.getId()) &&
                        c.getScheduledStartTime().toLocalDate().equals(date)
        );
    }

    private void createAndBookClass(
            Candidate candidate,
            Preference pref,
            LocalDateTime startTime,
            List<CreateClassDTO> newlyGeneratedDrafts,
            List<PracticalClass> allScheduledClasses
    ) {
        PracticalClass pClass = new PracticalClass();
        pClass.setScheduledStartTime(startTime);
        pClass.setScheduledEndTime(startTime.plusMinutes(90));
        pClass.setCandidate(candidate);


        if (pref != null) {
            pClass.setLocation(pref.getLocationName());
        }

        newlyGeneratedDrafts.add(new CreateClassDTO(pClass));
        allScheduledClasses.add(pClass);
    }



    private List<Candidate> sortCandidatesByPriority(List<Candidate> candidates, Map<Long, Preference> prefMap) {
        return candidates.stream().sorted((c1, c2) -> {

            //prvo sortiramo po statusu, najvecu prednost ima sumbitted pa carried pa no pref
            Preference p1 = prefMap.get(c1.getId());
            Preference p2 = prefMap.get(c2.getId());

            int statusRank1 = getStatusRank(p1);
            int statusRank2 = getStatusRank(p2);

            if (statusRank1 != statusRank2) {
                return Integer.compare(statusRank1, statusRank2);
            }

            // onda sortiramo po velicini liste time pred, ako je lista velika znaci da ima vi[e termina koji mu odgovaraju
            //ako je lista manja onda ima manje temrina koji mu odgovaraju
            int listSize1  =0 ;
            int listSize2  =0 ;

            if(p1.getTimePreferences() != null){
                listSize1 = p1.getTimePreferences().size();
            }else{
                listSize1 = Integer.MAX_VALUE;
            }
            if(p2.getTimePreferences() != null){
                listSize2 = p2.getTimePreferences().size();
            }else{
                listSize1 = Integer.MAX_VALUE;
            }

            return Integer.compare(listSize1, listSize2);
        }).collect(Collectors.toList());
    }

    private int getStatusRank(Preference pref) {
        if (pref == null || pref.getStatus() == PreferenceStatus.NO_PREFERENCE) return 3;
        if (pref.getStatus() == PreferenceStatus.CARRIED_OVER) return 2;
        if (pref.getStatus() == PreferenceStatus.SUBMITTED) return 1;
        return 4;
    }
}