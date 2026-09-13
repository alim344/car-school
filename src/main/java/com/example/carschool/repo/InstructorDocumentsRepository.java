package com.example.carschool.repo;

import com.example.carschool.model.Instructor;
import com.example.carschool.model.InstructorDocuments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstructorDocumentsRepository extends JpaRepository<InstructorDocuments, Integer> {

    List<InstructorDocuments> findByInstructor(Instructor instructor);

}
