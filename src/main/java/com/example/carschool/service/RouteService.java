package com.example.carschool.service;

import com.example.carschool.model.Route;
import com.example.carschool.repo.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    public Route findById(Long id){
        return routeRepository.findById(id).get();
    }
}
