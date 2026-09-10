package com.example.carschool.service;

import com.example.carschool.dto.CreateExamDTO;
import com.example.carschool.dto.InstructorDTO;
import com.example.carschool.dto.PracticalExamDTO;
import com.example.carschool.dto.TimeDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.PracticalExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class PracticalExamService {


    @Autowired
    private PracticalExamRepository practicalExamRepository;
    @Autowired
    private CandidateService candidateService;
    @Autowired
    private AdminService adminService;
    @Autowired
    private NotificationService notificationService;


    public List<PracticalExamDTO> getAll(){
        List<PracticalExam> practicalExams = practicalExamRepository.findAllByOrderByDateTimeDesc();
        List<PracticalExamDTO> practicalExamDTOs = new ArrayList<>();
        for (PracticalExam practicalExam : practicalExams) {
            practicalExamDTOs.add(new PracticalExamDTO(practicalExam));
        }
        return practicalExamDTOs;
    }

    public List<PracticalExamDTO> getExamsByStatus(ExamStatus examStatus){
        List<PracticalExamDTO> practicalExamDTOs = new ArrayList<>();
        List<PracticalExam> exams = practicalExamRepository.findByStatusOrderByDateTimeDesc(examStatus);
        for (PracticalExam exam : exams) {
            practicalExamDTOs.add(new PracticalExamDTO(exam));
        }
        return practicalExamDTOs;
    }

    public List<PracticalExamDTO> getByAdmin(Admin admin){
        List<PracticalExamDTO> practicalExamDTOs = new ArrayList<>();
        List<PracticalExam> exams = practicalExamRepository.findByAdmin(admin);
        for (PracticalExam exam : exams) {
            practicalExamDTOs.add(new PracticalExamDTO(exam));

        }
        return practicalExamDTOs;
    }




    public List<PracticalExamDTO> getByCandidate(Candidate candidate){
        List<PracticalExam> practicalExams = practicalExamRepository.findByCandidate(candidate);
        List<PracticalExamDTO> practicalExamDTOs = new ArrayList<>();
        for (PracticalExam practicalExam : practicalExams) {
            practicalExamDTOs.add(new PracticalExamDTO(practicalExam));
        }
        return practicalExamDTOs;
    }

    @Transactional
    public PracticalExamDTO createExam(CreateExamDTO createExamDTO){

        if (createExamDTO.getAdminEmail() == null) {
            throw new IllegalArgumentException("admin_email missing or null in request body");
        }
        if (createExamDTO.getCandidateEmail() == null) {
            throw new IllegalArgumentException("candidate_email missing or null in request body");
        }

        Candidate candidate = candidateService.getByEmail(createExamDTO.getCandidateEmail());
        Admin admin = adminService.findByEmail(createExamDTO.getAdminEmail());


        candidate.setStatus(TrainingStatus.EXAM_SCHEDULED);
        candidateService.save(candidate);

        PracticalExam practicalExam = new PracticalExam();
        practicalExam.setCandidate(candidate);
        practicalExam.setAdmin(admin);
        practicalExam.setDateTime(createExamDTO.getDateTime());
        practicalExam.setStatus(ExamStatus.SCHEDULED);
        PracticalExam saved = practicalExamRepository.save(practicalExam);
        notificationService.createNotification(NotificationType.EXAM_SCHEDULED, saved.getId(), candidate.getId());
        return new PracticalExamDTO(practicalExam);

    }

    @Transactional
    public PracticalExamDTO cancelExam(PracticalExamDTO practicalExamDTO){
        PracticalExam pe = practicalExamRepository.findById(practicalExamDTO.getId()).orElse(null);
        pe.setStatus(ExamStatus.CANCELLED);

        Candidate candidate = pe.getCandidate();
        candidate.setStatus(TrainingStatus.PENDING);
        candidateService.save(candidate);

        PracticalExam saved = practicalExamRepository.save(pe);
        notificationService.createNotification(NotificationType.EXAM_CANCELLED,saved.getId(), candidate.getId());
        return new PracticalExamDTO(pe);
    }

    @Transactional
    public PracticalExamDTO passExam(PracticalExamDTO practicalExamDTO){
        PracticalExam pe = practicalExamRepository.findById(practicalExamDTO.getId()).orElse(null);
        pe.setStatus(ExamStatus.COMPLETED);

        Candidate candidate = pe.getCandidate();
        candidate.setStatus(TrainingStatus.PASSED);
        candidateService.save(candidate);

        pe.setScore(practicalExamDTO.getScore());
        PracticalExam saved = practicalExamRepository.save(pe);
        notificationService.createNotification(NotificationType.EXAM_PASS,saved.getId(), candidate.getId());
        return new PracticalExamDTO(pe);
    }

    @Transactional
    public PracticalExamDTO failExam(PracticalExamDTO practicalExamDTO){
        PracticalExam pe = practicalExamRepository.findById(practicalExamDTO.getId()).orElse(null);
        pe.setStatus(ExamStatus.FAILED);

        Candidate candidate = pe.getCandidate();
        candidate.setStatus(TrainingStatus.PENDING);
        candidateService.save(candidate);

        pe.setScore(practicalExamDTO.getScore());
        PracticalExam saved = practicalExamRepository.save(pe);
        notificationService.createNotification(NotificationType.EXAM_PASS,saved.getId(), candidate.getId());
        return new PracticalExamDTO(pe);
    }



    public List<PracticalExamDTO> getByDate(TimeDTO timeDTO){

        LocalDate date = timeDTO.getDateTime().toLocalDate();

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<PracticalExam> pe =  practicalExamRepository.findByStatusAndDateTimeBetween(ExamStatus.SCHEDULED,startOfDay,endOfDay);

        List<PracticalExamDTO> dtos = pe.stream().map(PracticalExamDTO::new).toList();

        return dtos;
    }



}
