package com.catringPlatFrom.profile_service.controller;

import com.catringPlatFrom.profile_service.dto.request.CustomerProfileRequestDTO;
import com.catringPlatFrom.profile_service.dto.response.CustomerProfileResponseDTO;
import com.catringPlatFrom.profile_service.service.CustomerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@CrossOrigin("*")

public class CustomerProfileController {

    private final CustomerProfileService service;

    @PostMapping("/create")
    public CustomerProfileResponseDTO createProfile(
            @RequestBody CustomerProfileRequestDTO request
    ) {

        return service.createProfile(request);
    }

    @GetMapping("/{email}")
    public CustomerProfileResponseDTO getProfile(
            @PathVariable String email
    ) {

        return service.getProfileByEmail(email);
    }

    @GetMapping("/all")
    public List<CustomerProfileResponseDTO> getAllProfiles() {

        return service.getAllProfiles();
    }

    @PutMapping("/{id}")
    public CustomerProfileResponseDTO updateProfile(
            @PathVariable Long id,
            @RequestBody CustomerProfileRequestDTO request
    ) {

        return service.updateProfile(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteProfile(
            @PathVariable Long id
    ) {

        service.deleteProfile(id);

        return "Customer Profile Deleted Successfully";
    }
}