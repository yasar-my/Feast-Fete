package com.catringPlatFrom.authentication.controller;

import com.catringPlatFrom.authentication.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.HashMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;
import com.catringPlatFrom.authentication.entity.User;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/stats")
    public Map<String, Long> getStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalUsers",
                userRepository.count());

        stats.put("customers",
                userRepository.findByRole("CUSTOMER").stream().count());

        stats.put("organizers",
                userRepository.findByRole("ORGANIZER").stream().count());

        return stats;
    }
    @GetMapping("/users")
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }
    @DeleteMapping("/user/{id}")
    public String deleteUser(
            @PathVariable Long id
    ) {

        User user =
                userRepository.findById(id)
                        .orElseThrow();

        if(user.getRole().equals("ADMIN")) {

            return "Cannot delete admin";
        }

        userRepository.deleteById(id);

        return "User Deleted";
    }
}