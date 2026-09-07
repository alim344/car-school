package com.example.carschool.repo;

import com.example.carschool.model.CarChangeRequest;
import com.example.carschool.model.CarRequestStatus;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CarChangeRequestRepository extends JpaRepository<CarChangeRequest, Long> {


    List<CarChangeRequest> findByInstructor(Instructor instructor);

    CarChangeRequest findTopByInstructorOrderByRequestDateDesc(Instructor instructor);

    List<CarChangeRequest> findByVehicle(Vehicle vehicle);

    List<CarChangeRequest> findByStatus(CarRequestStatus status);

}
