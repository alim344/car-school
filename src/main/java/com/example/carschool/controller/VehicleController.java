package com.example.carschool.controller;

import com.example.carschool.dto.BrandDTO;
import com.example.carschool.dto.VehicleDTO;
import com.example.carschool.model.Candidate;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.VehicleStatus;
import com.example.carschool.service.CandidateService;
import com.example.carschool.service.InstructorService;
import com.example.carschool.service.VehicleService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicle")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private InstructorService instructorService;
    @Autowired
    private CandidateService candidateService;

    @GetMapping("/getAll")
    public ResponseEntity<List<VehicleDTO>> getAll(){
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/getByStatus/{status}")
    public ResponseEntity<List<VehicleDTO>> getByStatus(@PathVariable String status){

        try{
            VehicleStatus vehicleStatus = VehicleStatus.valueOf(status.toUpperCase());
            List<VehicleDTO> vehicleDTOS = vehicleService.getDTOByStatus(vehicleStatus);
            return ResponseEntity.ok(vehicleDTOS);
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        }




    }

    @GetMapping("/inst/in-use")
    public ResponseEntity<List<VehicleDTO>> findInUseByInstructor(HttpServletRequest  request){
        String token = tokenUtils.getToken(request);
        String email = tokenUtils.getEmailFromToken(token);

        Instructor instructor = instructorService.findByEmail(email);
        List<VehicleDTO> inUse = vehicleService.findByStatusAndInstructor(instructor,VehicleStatus.IN_USE);
        inUse.addAll(vehicleService.findByStatusAndInstructor(instructor,VehicleStatus.RESERVE));
        return ResponseEntity.ok(inUse);

    }

    @GetMapping("/get-brands")
    public ResponseEntity<List<BrandDTO>> getAllBrands(){
        return ResponseEntity.ok(vehicleService.getAllBrands());
    }


    @PostMapping("/add-vehicle")
    public ResponseEntity<VehicleDTO> addVehicle(@RequestBody VehicleDTO vehicleDTO){
        return ResponseEntity.ok(vehicleService.addVehicle(vehicleDTO));
    }


}
