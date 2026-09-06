package com.example.carschool.repo;

import com.example.carschool.model.Vehicle;
import com.example.carschool.model.VehicleMalfunctionRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleMalfunctionRecordRepository extends JpaRepository<VehicleMalfunctionRecord, Long> {

    VehicleMalfunctionRecord findByVehicle(Vehicle vehicle);

}
