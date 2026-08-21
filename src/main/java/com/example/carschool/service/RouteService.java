package com.example.carschool.service;

import com.example.carschool.model.Route;
import com.example.carschool.repo.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private CandidateService candidateService;

    public Route findById(Long id){
        return routeRepository.findById(id).get();
    }


    public List<Route> getAll(){
        return routeRepository.findAll();
    }


    public Route getRandomRoute(String candidateEmail){

        List<Route> unvisited = routeRepository.findUnvisitedRoutesForCandidate(candidateEmail);

        if(!unvisited.isEmpty()){
            int randomIndex = ThreadLocalRandom.current().nextInt(unvisited.size());
            return unvisited.get(randomIndex);
        }

        List<Route> allRoutes = getAll();
        int randomIndex = ThreadLocalRandom.current().nextInt(allRoutes.size());
        return allRoutes.get(randomIndex);
    }
}
