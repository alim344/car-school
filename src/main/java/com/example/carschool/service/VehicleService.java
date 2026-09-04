package com.example.carschool.service;

import com.example.carschool.dto.BrandDTO;
import com.example.carschool.dto.VehicleDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.VehicleBrandRepository;
import com.example.carschool.repo.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {


    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private InstructorService instructorService;
    @Autowired
    private VehicleBrandRepository vehicleBrandRepository;

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

    public List<BrandDTO> getAllBrands(){
       List<VehicleBrand> brands = vehicleBrandRepository.findAll();
        return brands.stream().map(BrandDTO::new).toList();
    }


    public VehicleBrand createNewBrand(BrandDTO dto){
        VehicleBrand vehicle_brand = new VehicleBrand();
        vehicle_brand.setBrand(dto.getBrand());
       vehicle_brand.setModel(dto.getModel());
       vehicle_brand.setYear(dto.getYear());
       vehicle_brand.setColour(dto.getColour());
       vehicleBrandRepository.save(vehicle_brand);
       return vehicle_brand;
    }



    @Transactional
    public VehicleDTO addVehicle(VehicleDTO dto){

        Vehicle vehicle = new Vehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicle.setCurrentMileage(dto.getCurrentMileage());
        vehicle.setRegistrationNumber(dto.getRegistrationNumber());
        vehicle.setRegistrationExpiryDate(dto.getRegistrationExpiryDate());


        VehicleBrand brand;

        if(dto.getBrand_id() == null){
            BrandDTO brandDTO = VehicleDTO.getBrandFromVehicle(dto);
            brand = createNewBrand(brandDTO);


        }else{
            brand = vehicleBrandRepository.findById(dto.getBrand_id()).orElse(null);
        }

        vehicle.setBrand(brand);
        vehicleRepository.save(vehicle);
        return new VehicleDTO(vehicle);
    }




}
