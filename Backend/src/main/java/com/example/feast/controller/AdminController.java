package com.example.feast.controller;

import com.example.feast.model.Admin;
import com.example.feast.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    @Autowired
    AdminService adminService;

    @PostMapping("/login")
    public boolean login(@RequestBody Admin loginRequest) {
        Admin admin = adminService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        return admin != null;
    }
}
