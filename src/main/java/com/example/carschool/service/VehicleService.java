package com.example.carschool.service;

import com.example.carschool.repo.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VehicleService {


    @Autowired
    private VehicleRepository vehicleRepository;

}
