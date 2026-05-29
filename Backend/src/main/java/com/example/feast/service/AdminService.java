package com.example.feast.service;

import com.example.feast.model.Admin;
import com.example.feast.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    AdminRepository adminRepository;

    public Admin authenticate(String email, String password) {
        return adminRepository.findByEmailAndPassword(email, password);
    }
}
