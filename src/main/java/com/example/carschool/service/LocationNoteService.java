package com.example.carschool.service;

import com.example.carschool.dto.LocationNoteDTO;
import com.example.carschool.model.LocationNote;
import com.example.carschool.model.PracticalClass;
import com.example.carschool.repo.LocationNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LocationNoteService {

    @Autowired
    private  PracticalClassService practicalClassService;
    @Autowired
    private LocationNoteRepository locationNoteRepository;


    public LocationNote leaveANote(LocationNoteDTO dto){

        LocationNote note = new LocationNote();
        PracticalClass practicalClass = practicalClassService.findById(dto.getClassId());

        note.setPracticalClass(practicalClass);
        note.setNote(dto.getNote());
        note.setCreatedAt(LocalDateTime.now());
        note.setLatitude(dto.getLatitude());
        note.setLongitude(dto.getLongitude());
        return locationNoteRepository.save(note);
    }
}
