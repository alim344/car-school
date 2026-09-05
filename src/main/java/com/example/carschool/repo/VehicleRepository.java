package com.example.carschool.repo;

import com.example.carschool.model.Instructor;
import com.example.carschool.model.Vehicle;
import com.example.carschool.model.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {


    List<Vehicle> findByStatus(VehicleStatus status);
    List<Vehicle> findByInstructorAndStatus(Instructor instructor, VehicleStatus status);
    List<Vehicle> findByInstructor(Instructor instructor);

}
