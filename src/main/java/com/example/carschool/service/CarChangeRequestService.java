package com.example.carschool.service;

import com.example.carschool.dto.CarRequestDTO;
import com.example.carschool.model.CarChangeRequest;
import com.example.carschool.model.CarRequestStatus;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.Vehicle;
import com.example.carschool.repo.CarChangeRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public void createRequest(CarRequestDTO carRequestDTO){
        CarChangeRequest carChangeRequest = new CarChangeRequest();

        Vehicle vehicle = vehicleService.getById(carRequestDTO.getVehicle_id());
        Instructor instructor = instructorService.findByEmail(carRequestDTO.getInstructor_email());

        if(vehicle == null ){
           throw new IllegalArgumentException("Vehicle does not exist");
        }
        if(instructor == null ){
            throw new IllegalArgumentException("Instructor does not exist");
        }

        if( vehicle.getPrimaryInstructor() != null){
            throw new IllegalArgumentException("Vehicle already has primary instructor");
        }


        carChangeRequest.setVehicle(vehicle);
        carChangeRequest.setInstructor(instructor);
        carChangeRequest.setStatus(CarRequestStatus.PENDING);
        carChangeRequestRepository.save(carChangeRequest);

    }


}
