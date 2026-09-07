package com.example.carschool.service;

import com.example.carschool.dto.CarRequestDTO;
import com.example.carschool.model.*;
import com.example.carschool.repo.CarChangeRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class CarChangeRequestService {

    @Autowired
    private CarChangeRequestRepository carChangeRequestRepository;
    @Autowired
    private VehicleService vehicleService;
    @Autowired
    private InstructorService instructorService;

    public List<CarChangeRequest> findAll(){
        return carChangeRequestRepository.findAll();
    }

    public List<CarRequestDTO> getAllDtos(){
        List<CarChangeRequest> requests = carChangeRequestRepository.findAll();
        return requests.stream().map(CarRequestDTO::new).toList();
    }

    public List<CarRequestDTO> getByInstructor(Instructor instructor){
        List<CarChangeRequest> requests = carChangeRequestRepository.findByInstructor(instructor);
        return requests.stream().map(CarRequestDTO::new).toList();
    }

    public void createRequest(CarRequestDTO carRequestDTO,Instructor instructor){
        CarChangeRequest carChangeRequest = new CarChangeRequest();

        Vehicle vehicle = vehicleService.getById(carRequestDTO.getVehicle_id());


        if(vehicle == null ){
           throw new IllegalArgumentException("Vehicle does not exist");
        }

        if( vehicle.getPrimaryInstructor() != null){
            throw new IllegalArgumentException("Vehicle already has primary instructor");
        }


        carChangeRequest.setVehicle(vehicle);
        carChangeRequest.setInstructor(instructor);
        carChangeRequest.setStatus(CarRequestStatus.PENDING);
        carChangeRequest.setRequestDate( LocalDateTime.now());
        carChangeRequestRepository.save(carChangeRequest);

    }


    public void declineThatVehicleRequests(Vehicle vehicle){
        List<CarChangeRequest> requests = carChangeRequestRepository.findByVehicle(vehicle);
        for (CarChangeRequest carChangeRequest : requests) {
            carChangeRequest.setStatus(CarRequestStatus.DECLINED);
            carChangeRequestRepository.save(carChangeRequest);
        }
    }

    @Transactional
    public void acceptRequest(CarRequestDTO carRequestDTO){

        CarChangeRequest carChangeRequest = carChangeRequestRepository.findById(carRequestDTO.getId()).orElse(null);
        if(carChangeRequest == null){
            throw new IllegalArgumentException("Car does not exist");
        }




        Vehicle vehicle = vehicleService.getById(carRequestDTO.getVehicle_id());

        declineThatVehicleRequests(vehicle);

        vehicle.setStatus(VehicleStatus.WAITING_FOR_PICKUP);
        vehicleService.save(vehicle);

        carChangeRequest.setStatus(CarRequestStatus.ACCEPTED);
        carChangeRequestRepository.save(carChangeRequest);

    }

    public void declineRequest(CarRequestDTO requestDTO){
        CarChangeRequest carChangeRequest = carChangeRequestRepository.findById(requestDTO.getId()).orElse(null);
        if(carChangeRequest == null){
            throw new IllegalArgumentException("Car does not exist");
        }

        carChangeRequest.setStatus(CarRequestStatus.DECLINED);
        carChangeRequestRepository.save(carChangeRequest);
    }

    @Transactional
    public void setAsPrimaryCar(CarRequestDTO dto){

        CarChangeRequest carChangeRequest = carChangeRequestRepository.findById(dto.getId()).orElse(null);
        if(carChangeRequest == null){
            throw new IllegalArgumentException("Car does not exist");
        }

        carChangeRequest.setPickedUp(true);
        Instructor instructor = instructorService.findByEmail(dto.getInstructor_email());
        if(instructor == null){
            throw new IllegalArgumentException("Instructor not found");
        }


        Vehicle newVehicle = vehicleService.getById(dto.getVehicle_id());

        if(newVehicle == null){
            throw new IllegalArgumentException("new vehicle not found");
        }




        Vehicle currentlyPrimaryVehicle = instructor.getPrimaryVehicle();
        Vehicle currentlyActiveVehicle = instructor.getVehicle();

        if(currentlyPrimaryVehicle.getStatus() == VehicleStatus.IN_USE ){
            currentlyPrimaryVehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleService.save(currentlyPrimaryVehicle);
        }
        if(currentlyActiveVehicle.getStatus() == VehicleStatus.RESERVE){
            currentlyActiveVehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleService.save(currentlyActiveVehicle);
        }

        newVehicle.setStatus(VehicleStatus.IN_USE);

        instructor.setVehicle(newVehicle);

        instructor.setPrimaryVehicle(newVehicle);
        instructorService.save(instructor);


    }

    public CarRequestDTO findLatestRequest(Instructor instructor){

        CarChangeRequest request =  carChangeRequestRepository.findTopByInstructorOrderByRequestDateDesc(instructor);
        return new CarRequestDTO(request);

    }

    public List<CarRequestDTO> findByStatus(CarRequestStatus status){
        List<CarChangeRequest> requests = carChangeRequestRepository.findByStatus(status);
        return requests.stream().map(CarRequestDTO::new).toList();
    }



}
