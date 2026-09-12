package com.example.carschool.service;

import com.example.carschool.dto.FuelRecordDTO;
import com.example.carschool.model.FuelRecord;
import com.example.carschool.repo.FuelRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class FuelRecordService {

    @Autowired
    private FuelRecordRepository fuelRecordRepository;


    public Page<FuelRecordDTO> getRecordsByVehicle(Long vehicleId, int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        return fuelRecordRepository.findByVehicleIdOrderByRefuelDateDesc(vehicleId, pageable).map(FuelRecordDTO::new);

    }


    public Page<FuelRecordDTO> getRecordsByVehicleAndDate(Long vehicleId, LocalDate start, LocalDate end, int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        return fuelRecordRepository.findByVehicleIdAndRefuelDateBetweenOrderByRefuelDateDesc(vehicleId, start, end, pageable).map(FuelRecordDTO::new);
    }


}
