package com.example.carschool.controller;

import com.example.carschool.model.Route;
import com.example.carschool.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/route")
public class RouteController {

    @Autowired
    private RouteService routeService;


    @GetMapping("/getAll")
    public ResponseEntity<List<Route>> getAllRoutes(){
        return ResponseEntity.ok(routeService.getAll());
    }

    @GetMapping("/getRandom")
    public ResponseEntity<Route> getRandomRoute(@RequestBody String email){
        return ResponseEntity.ok(routeService.getRandomRoute(email));
    }



}
