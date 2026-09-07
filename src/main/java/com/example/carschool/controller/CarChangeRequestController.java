package com.example.carschool.controller;

import com.example.carschool.dto.CarRequestDTO;
import com.example.carschool.model.Instructor;
import com.example.carschool.service.CarChangeRequestService;
import com.example.carschool.service.InstructorService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/car-request")
public class CarChangeRequestController {

    @Autowired
    private CarChangeRequestService carChangeRequestService;

    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private InstructorService instructorService;

    @GetMapping("/getAll")
    public ResponseEntity<List<CarRequestDTO>> getAll(){
        return ResponseEntity.ok(carChangeRequestService.getAllDtos());
    }

    @GetMapping("/inst/get")
    public ResponseEntity<List<CarRequestDTO>> findByInstructor(HttpServletRequest request){

        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);
        Instructor instructor = instructorService.findByEmail(email);

        return ResponseEntity.ok(carChangeRequestService.getByInstructor(instructor));
    }


    @PostMapping("/inst/create")
    public ResponseEntity<?> createRequest(@RequestBody CarRequestDTO carRequestDTO){
        carChangeRequestService.createRequest(carRequestDTO);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/accept")
    public ResponseEntity<?> acceptRequest(@RequestBody CarRequestDTO dto){
        carChangeRequestService.acceptRequest(dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/decline")
    public ResponseEntity<?> declineRequest(@RequestBody CarRequestDTO dto){
        carChangeRequestService.declineRequest(dto);
        return ResponseEntity.ok().build();
    }


    @PatchMapping("/set-primary-car")
    public ResponseEntity<?> setAsPrimaryCar(@RequestBody  CarRequestDTO dto){
        carChangeRequestService.setAsPrimaryCar(dto);
        return ResponseEntity.ok().build();
    }

}
