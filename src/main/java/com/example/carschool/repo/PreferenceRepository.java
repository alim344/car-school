package com.example.carschool.repo;

import com.example.carschool.model.Preference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreferenceRepository extends JpaRepository<Preference, Long> {
}
