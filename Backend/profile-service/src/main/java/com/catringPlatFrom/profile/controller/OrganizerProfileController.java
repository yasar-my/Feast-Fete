package com.catringPlatFrom.profile_service.controller;

import com.catringPlatFrom.profile_service.dto.request.OrganizerProfileRequestDTO;
import com.catringPlatFrom.profile_service.dto.response.OrganizerProfileResponseDTO;
import com.catringPlatFrom.profile_service.service.OrganizerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer")
@RequiredArgsConstructor
@CrossOrigin("*")

public class OrganizerProfileController {

    private final OrganizerProfileService service;

    @PostMapping("/create")
    public OrganizerProfileResponseDTO createProfile(
            @RequestBody OrganizerProfileRequestDTO request
    ) {

        return service.createProfile(request);
    }

    @GetMapping("/{email}")
    public OrganizerProfileResponseDTO getProfile(
            @PathVariable String email
    ) {

        return service.getProfileByEmail(email);
    }

    @GetMapping("/all")
    public List<OrganizerProfileResponseDTO> getAllProfiles() {

        return service.getAllProfiles();
    }

    @PutMapping("/{id}")
    public OrganizerProfileResponseDTO updateProfile(
            @PathVariable Long id,
            @RequestBody OrganizerProfileRequestDTO request
    ) {

        return service.updateProfile(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteProfile(
            @PathVariable Long id
    ) {

        service.deleteProfile(id);

        return "Profile Deleted Successfully";
    }

    @DeleteMapping("/email/{email}")
    public String deleteProfileByEmail(
            @PathVariable String email
    ) {

        service.deleteProfileByEmail(email);

        return "Profile Deleted Successfully";
    }
}