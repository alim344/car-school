package com.example.carschool.service;

import com.example.carschool.dto.VehicleDTO;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.Vehicle;
import com.example.carschool.model.VehicleStatus;
import com.example.carschool.repo.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {


    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private InstructorService instructorService;

    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }


    public List<VehicleDTO> getAllVehicles(){
        List<Vehicle> vehicles = getAll();
        return vehicles.stream().map(VehicleDTO::new).toList();
    }





    public List<Vehicle> getByStatus(VehicleStatus status){
        return vehicleRepository.findByStatus(status);
    }

    public List<VehicleDTO> getDTOByStatus(VehicleStatus status){
        List<Vehicle> vehicles = getByStatus(status);
        return vehicles.stream().map(VehicleDTO::new).toList();
    }

    public List<VehicleDTO> findByStatusAndInstructor(Instructor instructor,VehicleStatus status){
        List<Vehicle> vehicles  = vehicleRepository.findByInstructorAndStatus(instructor, status);
        return vehicles.stream().map(VehicleDTO::new).toList();
    }


    public VehicleDTO setVehicleStatus(VehicleDTO dto){
        Vehicle vehicle = vehicleRepository.findById(dto.getId()).orElse(null);
        vehicle.setStatus(dto.getStatus());
        return new VehicleDTO(vehicleRepository.save(vehicle));
    }

    public void assignVehicleToInstructor(VehicleDTO dto){
        Vehicle vehicle = vehicleRepository.findById(dto.getId()).orElse(null);


        if(vehicle.getStatus() == VehicleStatus.AVAILABLE){
            Instructor instructor = instructorService.findByEmail(dto.getInstructor_email());
            vehicle.setInstructor(instructor);
        }

        vehicle.setStatus(VehicleStatus.IN_USE);
        vehicleRepository.save(vehicle);
    }

    public void reportVehicleOutOfService(VehicleDTO dto){
        Vehicle vehicle = vehicleRepository.findById(dto.getId()).orElse(null);


        if(vehicle.getStatus() == VehicleStatus.IN_USE){
            if(vehicle.getInstructor() != null){
                vehicle.setStatus(VehicleStatus.OUT_OF_SERVICE);
                vehicleRepository.save(vehicle);
            }
        }
    }

    public void makeReserveAvailable(VehicleDTO dto){

        Vehicle vehicle = vehicleRepository.findById(dto.getId()).orElse(null);
        if(vehicle.getStatus() == VehicleStatus.RESERVE){
            if(vehicle.getInstructor() != null){
                vehicle.setStatus(VehicleStatus.AVAILABLE);
                vehicle.setInstructor(null);
                vehicleRepository.save(vehicle);
            }
        }

    }




}
