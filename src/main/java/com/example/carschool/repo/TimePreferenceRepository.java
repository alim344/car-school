package com.example.carschool.repo;

import com.example.carschool.model.TimePreference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimePreferenceRepository extends JpaRepository<TimePreference, Integer> {
}
