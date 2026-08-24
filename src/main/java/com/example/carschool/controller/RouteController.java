package com.example.carschool.controller;

import com.example.carschool.dto.LocationNoteDTO;
import com.example.carschool.model.LocationNote;
import com.example.carschool.model.Route;
import com.example.carschool.service.LocationNoteService;
import com.example.carschool.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/route")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @Autowired
    private LocationNoteService locationNoteService;


    @GetMapping("/getAll")
    public ResponseEntity<List<Route>> getAllRoutes(){
        return ResponseEntity.ok(routeService.getAll());
    }

    @GetMapping("/getRandom")
    public ResponseEntity<Route> getRandomRoute(@RequestParam String email){
        return ResponseEntity.ok(routeService.getRandomRoute(email));
    }

    @PostMapping("/leaveNote")
    public ResponseEntity<LocationNoteDTO> leaveANote(@RequestBody LocationNoteDTO note){
        return ResponseEntity.ok(locationNoteService.leaveANote(note));
    }
    @GetMapping("/notes/{classId}")
    public ResponseEntity<List<LocationNoteDTO>> getNotesForClass(@PathVariable Long classId){
        return ResponseEntity.ok(locationNoteService.getNotesForClass(classId));
    }

    @DeleteMapping("/note/delete/{noteId}")
    public ResponseEntity<?> deleteNote(@PathVariable Long noteId){
        locationNoteService.deleteNote(noteId);
        return ResponseEntity.ok().build();
    }

}
