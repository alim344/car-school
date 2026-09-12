package com.example.carschool.controller;

import com.example.carschool.dto.FuelRecordDTO;
import com.example.carschool.model.Instructor;
import com.example.carschool.service.FuelRecordService;
import com.example.carschool.service.InstructorService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/fuel")
public class FuelRecordController {

    @Autowired
    private FuelRecordService fuelRecordService;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private InstructorService instructorService;

    @GetMapping("/get-inst/{vehicleId}")
    public ResponseEntity<Page<FuelRecordDTO>> getFuelRecord(@PathVariable Long vehicleId, @RequestParam LocalDate start,
                                                             @RequestParam LocalDate end,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size){

        return ResponseEntity.ok(fuelRecordService.getRecordsByVehicleAndDate(vehicleId, start, end, page, size));
    }


    @PostMapping("/save")
    public ResponseEntity<?> saveRecord(@RequestBody FuelRecordDTO fuelRecordDTO, HttpServletRequest request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);
        fuelRecordService.saveFuelRecord(fuelRecordDTO,instructor);
        return ResponseEntity.ok().build();
    }


}
