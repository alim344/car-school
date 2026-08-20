package com.example.carschool.repo;

import com.example.carschool.model.PracticalClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PracticalClassRepository extends JpaRepository<PracticalClass, Long> {


}
