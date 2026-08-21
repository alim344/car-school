package com.example.carschool.repo;

import com.example.carschool.model.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {

    Instructor findByName(String name);
    Instructor findByEmail(String email);
}
