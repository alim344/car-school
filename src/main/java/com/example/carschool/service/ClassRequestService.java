package com.example.carschool.service;

import com.example.carschool.dto.ClassRequestDTO;
import com.example.carschool.model.ClassRequest;
import com.example.carschool.model.Instructor;
import com.example.carschool.repo.ClassRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClassRequestService {

    @Autowired
    private ClassRequestRepository classRequestRepository;


    public List<ClassRequestDTO> getInstructorRequests(Instructor instructor) {
        List<ClassRequest> requests = classRequestRepository.findByInstructor(instructor);

        List<ClassRequestDTO> instructorRequests = new ArrayList<>();

        for (ClassRequest request : requests) {
            instructorRequests.add(new ClassRequestDTO(request));
        }
        return instructorRequests;

    }

    public void deleteRequest(Long requestId) {
       classRequestRepository.deleteById(requestId);
    }

    public Integer getNumberOfClassRequests(Instructor instructor) {
        return classRequestRepository.findByInstructor(instructor).size();
    }


}
