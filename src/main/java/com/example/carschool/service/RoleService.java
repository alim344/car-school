package com.example.carschool.service;

import com.example.carschool.model.Role;
import com.example.carschool.repo.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {


    @Autowired
    private RoleRepository roleRepository;


    public Role findById(Long id) {
        Role auth = this.roleRepository.getOne(id);
        return auth;
    }


    public Role findByRole(String name) {
        Role role  = this.roleRepository.findByRole(name);
        return role;
    }
}
