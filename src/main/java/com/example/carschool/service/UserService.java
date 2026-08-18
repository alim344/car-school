package com.example.carschool.service;

import com.example.carschool.model.User;
import com.example.carschool.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public User findByEmail(String email){
        return userRepository.findByEmail(email);
    }
    public User findByUsername(String username){
        return userRepository.findByUsername(username);
    }



}
