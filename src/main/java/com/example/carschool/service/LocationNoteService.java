package com.example.carschool.service;

import com.example.carschool.dto.LocationNoteDTO;
import com.example.carschool.model.LocationNote;
import com.example.carschool.model.PracticalClass;
import com.example.carschool.repo.LocationNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LocationNoteService {

    @Autowired
    private  PracticalClassService practicalClassService;
    @Autowired
    private LocationNoteRepository locationNoteRepository;




    @Transactional
    public LocationNoteDTO leaveANote(LocationNoteDTO dto) {
        try {
            System.out.println("=== Creating Location Note ===");
            System.out.println("ClassId: " + dto.getClassId());
            System.out.println("Latitude: " + dto.getLatitude());
            System.out.println("Longitude: " + dto.getLongitude());
            System.out.println("Note: " + dto.getNote());

            PracticalClass practicalClass = practicalClassService.findById(dto.getClassId());
            System.out.println("Found PracticalClass with ID: " + practicalClass.getId());

            LocationNote note = new LocationNote();
            note.setPracticalClass(practicalClass);
            note.setLatitude(dto.getLatitude());
            note.setLongitude(dto.getLongitude());
            note.setNote(dto.getNote());
            note.setCreatedAt(LocalDateTime.now());

            LocationNote savedNote = locationNoteRepository.save(note);
            System.out.println("Saved LocationNote with ID: " + savedNote.getId());

            return new LocationNoteDTO(savedNote);

        } catch (Exception e) {
            System.err.println("Error saving location note: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<LocationNoteDTO> getNotesForClass(Long classId) {
        return locationNoteRepository.findByPracticalClassId(classId)
                .stream()
                .map(LocationNoteDTO::new)
                .toList();
    }


    public void deleteNote(Long id) {
        locationNoteRepository.deleteById(id);
    }
}
