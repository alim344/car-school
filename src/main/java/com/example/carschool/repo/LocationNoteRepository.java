package com.example.carschool.repo;

import com.example.carschool.model.LocationNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationNoteRepository extends JpaRepository<LocationNote, Long> {

    List<LocationNote> findByPracticalClassId(Long practicalClassId);
}
