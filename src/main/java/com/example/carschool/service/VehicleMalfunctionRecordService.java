package com.example.carschool.service;

import com.example.carschool.model.Vehicle;
import com.example.carschool.model.VehicleMalfunctionRecord;
import com.example.carschool.repo.VehicleMalfunctionRecordRepository;
import com.example.carschool.repo.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class VehicleMalfunctionRecordService {



    @Autowired
    private VehicleMalfunctionRecordRepository malfunctionRecordRepository;




    public void createRecord(Vehicle vehicle) {

        VehicleMalfunctionRecord record = new VehicleMalfunctionRecord();
        record.setVehicle(vehicle);
        record.setFixed(false);
        record.setMalfunctionDate(LocalDate.now());
        malfunctionRecordRepository.save(record);
    }


}
