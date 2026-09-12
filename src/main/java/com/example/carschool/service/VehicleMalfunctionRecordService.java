package com.example.carschool.service;

import com.example.carschool.dto.MalfunctionDTO;
import com.example.carschool.model.NotificationType;
import com.example.carschool.model.Vehicle;
import com.example.carschool.model.VehicleMalfunctionRecord;
import com.example.carschool.repo.VehicleMalfunctionRecordRepository;
import com.example.carschool.repo.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class VehicleMalfunctionRecordService {



    @Autowired
    private VehicleMalfunctionRecordRepository malfunctionRecordRepository;
    @Autowired
    private NotificationService notificationService;


    public void createRecord(Vehicle vehicle) {

        VehicleMalfunctionRecord record = new VehicleMalfunctionRecord();
        record.setVehicle(vehicle);
        record.setFixed(false);
        record.setMalfunctionDate(LocalDate.now());
        malfunctionRecordRepository.save(record);
    }

    @Transactional
    public void fixVehicle(Vehicle vehicle) {
        VehicleMalfunctionRecord record = malfunctionRecordRepository.findTopByVehicleOrderByMalfunctionDateDesc(vehicle);
        if(record == null) {
            throw new IllegalArgumentException("No record found for vehicle: " + vehicle);
        }
        record.setFixed(true);
        record.setFixedDate(LocalDate.now());
        malfunctionRecordRepository.save(record);
        notificationService.createNotification(NotificationType.CAR_FIXED, vehicle.getId(), vehicle.getPrimaryInstructor().getId(),vehicle.getRegistrationNumber());
    }

    public VehicleMalfunctionRecord findByVehicle(Vehicle vehicle) {
        return  malfunctionRecordRepository.findTopByVehicleOrderByMalfunctionDateDesc(vehicle);
    }




}
