package com.example.carschool.repo;

import com.example.carschool.model.FuelRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface FuelRecordRepository extends JpaRepository<FuelRecord, Long> {

    Page<FuelRecord> findByVehicleIdOrderByRefuelDateDesc(Long vehicleId, Pageable pageable);
    Page<FuelRecord> findByVehicleIdAndRefuelDateBetweenOrderByRefuelDateDesc(Long vehicleId, LocalDate start, LocalDate end, Pageable pageable);

}
