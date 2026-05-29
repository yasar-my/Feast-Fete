package com.example.feast.controller;

import com.example.feast.model.OrganizerProfile;
import com.example.feast.service.OrganizerProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/organizer")
@CrossOrigin
public class OrganizerProfileController {

    @Autowired
    private OrganizerProfileService service;

    @PostMapping("/register")
    public OrganizerProfile registerOrganizer(@RequestBody OrganizerProfile organizer) {
        return service.registerOrganizer(organizer);
    }
    // GET profile details
    @GetMapping("/profile")
    public OrganizerProfile getProfile(@RequestParam String email) {
        return service.getProfileByEmail(email);
    }

    // POST for save/edit profile details
    @PutMapping("/profile-edit")
    public OrganizerProfile saveOrUpdateProfile(@RequestBody OrganizerProfile profile) {
        return service.saveOrUpdateProfile(profile);
    }

    @GetMapping("/list")
    public List<OrganizerProfile> getAllCaterers() {
        return service.getAllProfiles();
    }

    @GetMapping("/profile-by-id")
    public OrganizerProfile getProfileById(@RequestParam Long id) {
        return service.getProfileById(id);
    }
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, Object> response = new HashMap<>();
        boolean success = service.authenticate(email, password);
        response.put("success", success);

        if (success) {
            response.put("email", email);
        }
        return response;
    }
    @DeleteMapping("/delete/{id}")
    public void deleteOrganizer(@PathVariable Long id) {
        service.deleteOrganizer(id);
    }

}
