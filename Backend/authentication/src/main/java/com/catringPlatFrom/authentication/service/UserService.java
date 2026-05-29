package com.catringPlatFrom.authentication.service;

import com.catringPlatFrom.authentication.entity.User;
import com.catringPlatFrom.authentication.dto.AuthResponseDTO;
import com.catringPlatFrom.authentication.dto.LoginRequestDTO;
import com.catringPlatFrom.authentication.dto.RegisterRequestDTO;

import java.util.List;

public interface UserService {

    String register(RegisterRequestDTO request);

    AuthResponseDTO login(LoginRequestDTO request);

    List<User> getOrganizers();
}