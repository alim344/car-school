package com.example.carschool.controller;

import com.example.carschool.dto.VehicleDTO;
import com.example.carschool.model.Instructor;
import com.example.carschool.model.VehicleStatus;
import com.example.carschool.service.InstructorService;
import com.example.carschool.service.VehicleService;
import com.example.carschool.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/getAll")
    public ResponseEntity<List<VehicleDTO>> getAll(){
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/{status}")
    public ResponseEntity<List<VehicleDTO>> getByStatus(@PathVariable String status){
        List<VehicleDTO> vehicleDTOS;
        if(status.toLowerCase().equals(VehicleStatus.AVAILABLE.toString()) ){
            vehicleDTOS = vehicleService.getDTOByStatus(VehicleStatus.AVAILABLE);
        }else if(status.toLowerCase().equals(VehicleStatus.IN_USE.toString())){
            vehicleDTOS = vehicleService.getDTOByStatus(VehicleStatus.IN_USE);
        }else if(status.toLowerCase().equals(VehicleStatus.OUT_OF_SERVICE.toString())){
            vehicleDTOS =  vehicleService.getDTOByStatus(VehicleStatus.OUT_OF_SERVICE);
        }else{
            vehicleDTOS = vehicleService.getDTOByStatus(VehicleStatus.RESERVE);
        }

        return ResponseEntity.ok(vehicleDTOS);

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




}
