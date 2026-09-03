package com.example.carschool.repo;

import com.example.carschool.model.FuelRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuelRecordRepository extends JpaRepository<FuelRecord, Long> {
}
