package com.example.carschool.service;

import com.example.carschool.dto.*;
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
    @Autowired
    private VehicleMalfunctionRecordService vehicleMalfunctionRecordService;

    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }


    public List<VehicleDTO> getAllVehicles(){
        List<Vehicle> vehicles = getAll();
        return vehicles.stream().map(VehicleDTO::new).toList();
    }


    public VehicleDTO getDTOById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id).orElse(null);
        if(vehicle != null) {
            return new VehicleDTO(vehicle);
        }
        return null;
    }

    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id).orElse(null);
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

    @Transactional
    public void assignVehicleToInstructor(AssignVehicleDTO dto){
        Vehicle vehicle = vehicleRepository.findById(dto.getId()).orElse(null);

        if (vehicle == null) {
            throw new IllegalArgumentException("Vehicle not found");
        }
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new IllegalStateException("Only an AVAILABLE vehicle can be assigned as a reserve");
        }

        Instructor instructor = instructorService.findByEmail(dto.getInstructor_email());
        if (instructor == null) {
            throw new IllegalArgumentException("Instructor not found");
        }

        Vehicle primary = instructor.getPrimaryVehicle();
        boolean isFirstVehicle = primary == null;




            if (isFirstVehicle) {
                instructor.setVehicle(vehicle);
                instructor.setPrimaryVehicle(vehicle);
                vehicle.setStatus(VehicleStatus.IN_USE);
            }else{
                if (primary.getStatus() != VehicleStatus.OUT_OF_SERVICE) {
                    throw new IllegalStateException("Instructor already has an active vehicle; primary must be OUT_OF_SERVICE to assign a reserve");
                }
                instructor.setVehicle(vehicle);
                vehicle.setStatus(VehicleStatus.RESERVE);
            }


        vehicleRepository.save(vehicle);
        instructorService.save(instructor);
    }



    public void makeReserveAvailable(Long id){

        Vehicle vehicle = vehicleRepository.findById(id).orElse(null);
        if(vehicle.getStatus() == VehicleStatus.RESERVE){
            if(vehicle.getInstructor() != null){
                vehicle.setStatus(VehicleStatus.AVAILABLE);

                Instructor instructor = vehicle.getInstructor();
                instructor.setVehicle(null);
                instructorService.save(instructor);
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


    public List<VehicleDTO> findByInstructor(Instructor instructor){
        List<Vehicle> vehicles = vehicleRepository.findByInstructorOrPrimaryInstructor    (instructor,instructor);
        return vehicles.stream().map(VehicleDTO::new).toList();
    }


    public void updateVehicle(VehicleUpdateDTO dto){
        Vehicle vehicle = vehicleRepository.findById(dto.getId()).orElse(null);
        if (vehicle != null ) {

            if(vehicle.getStatus() == VehicleStatus.IN_USE || vehicle.getStatus() == VehicleStatus.RESERVE){
                if(dto.getMileage() != null){
                    vehicle.setCurrentMileage(dto.getMileage());
                }

                if(dto.getRegistrationExpiryDate() != null){
                    vehicle.setRegistrationExpiryDate(dto.getRegistrationExpiryDate());
                }

                vehicleRepository.save(vehicle);
            }


        }else{
            throw new IllegalArgumentException("Vehicle not found");
        }
    }

    @Transactional
    public void reportOutOfService(Long id){

        Vehicle vehicle = vehicleRepository.findById(id).orElse(null);
        if(vehicle != null){
            if(vehicle.getStatus() != VehicleStatus.OUT_OF_SERVICE ){
                vehicle.setStatus(VehicleStatus.OUT_OF_SERVICE);
                Instructor instructor = vehicle.getInstructor();
                if(instructor != null){
                    instructor.setVehicle(null);
                    instructorService.save(instructor);
                }
                vehicleRepository.save(vehicle);
                vehicleMalfunctionRecordService.createRecord(vehicle);
            }else{
                throw new IllegalArgumentException("Vehicle is not in use to declare out of service");
            }
        }

    }

    public void deleteVehicle(Long id){
        vehicleRepository.deleteById(id);
    }


    @Transactional
    public void fixVehicle(Long id){

        Vehicle vehicle = vehicleRepository.findById(id).orElse(null);
        if(vehicle == null){
            throw new IllegalArgumentException("Vehicle not found");
        }

        vehicleMalfunctionRecordService.fixVehicle(vehicle);
        Instructor instructor = vehicle.getPrimaryInstructor();
        if(instructor == null){
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        }
        vehicleRepository.save(vehicle);
    }


    @Transactional
    public void ActivatePrimaryVehicle(Long id){

        Vehicle vehicle = vehicleRepository.findById(id).orElse(null);
        if(vehicle == null){
            throw new IllegalArgumentException("Vehicle not found");
        }

        Instructor instructor = vehicle.getPrimaryInstructor();
        if(instructor == null){
            throw new IllegalArgumentException("Primary instructor not found");
        }

        if(instructor.getVehicle() != null){
            throw new IllegalArgumentException("Primary instructor already has an active vehicle");
        }

        vehicle.setStatus(VehicleStatus.IN_USE);
        instructor.setVehicle(vehicle);
        instructorService.save(instructor);
        vehicleRepository.save(vehicle);


    }


    public MalfunctionDTO getByVehicleId(Long id){
        Vehicle vehicle = vehicleRepository.findById(id).orElse(null);
        if(vehicle == null){
            throw new IllegalArgumentException("Vehicle not found");
        }
        VehicleMalfunctionRecord record = vehicleMalfunctionRecordService.findByVehicle(vehicle);
        return new MalfunctionDTO(record);

    }


}
