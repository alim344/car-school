package com.example.carschool.controller;

import com.example.carschool.dto.CandidatePreferencesDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.service.CandidateService;
import com.example.carschool.service.PreferenceService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.channels.ReadPendingException;

@RestController
@RequestMapping("/pref")
public class PreferenceController {

    @Autowired
    private  CandidateService candidateService;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private PreferenceService preferenceService;


    @GetMapping("/candidate/get")
    public ResponseEntity<CandidatePreferencesDTO> getCandidatePref(HttpServletRequest request) {
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Candidate candidate = candidateService.getByEmail(email);
        return ResponseEntity.ok(preferenceService.getCandidatePreference(candidate));

    }


    @PostMapping("/save")
    public ResponseEntity<?> savePreference(@RequestBody CandidatePreferencesDTO preferenceDTO) {
        preferenceService.save(preferenceDTO);
        return ResponseEntity.ok().build();

    }

    @PatchMapping("/update")
    public ResponseEntity<?> updatePreference(@RequestBody CandidatePreferencesDTO preferenceDTO) {
        preferenceService.updateTimePreferences(preferenceDTO);
        return ResponseEntity.ok().build();
    }


}
