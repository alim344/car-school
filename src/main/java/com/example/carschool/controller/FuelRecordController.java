package com.example.carschool.controller;

import com.example.carschool.dto.FuelRecordDTO;
import com.example.carschool.service.FuelRecordService;
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

    @GetMapping("/get-inst/{vehicleId}")
    public ResponseEntity<Page<FuelRecordDTO>> getFuelRecord(@PathVariable Long vehicleId, @RequestParam LocalDate start,
                                                             @RequestParam LocalDate end,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size){

        return ResponseEntity.ok(fuelRecordService.getRecordsByVehicleAndDate(vehicleId, start, end, page, size));
    }


}
