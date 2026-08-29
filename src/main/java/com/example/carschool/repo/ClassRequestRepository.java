package com.example.carschool.repo;

import com.example.carschool.model.ClassRequest;
import com.example.carschool.model.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassRequestRepository extends JpaRepository<ClassRequest, Long> {

    List<ClassRequest> findByInstructor(Instructor instructor);

}
