package com.catringPlatFrom.authentication.controller;

import com.catringPlatFrom.authentication.payload.ApiResponse;
import com.catringPlatFrom.authentication.security.JwtService;
import com.catringPlatFrom.authentication.service.RefreshTokenService;

import com.catringPlatFrom.authentication.dto.RefreshTokenRequestDTO;
import com.catringPlatFrom.authentication.dto.RefreshTokenResponseDTO;
import com.catringPlatFrom.authentication.entity.RefreshToken;

import com.catringPlatFrom.authentication.dto.AuthResponseDTO;
import com.catringPlatFrom.authentication.dto.LoginRequestDTO;
import com.catringPlatFrom.authentication.dto.RegisterRequestDTO;

import com.catringPlatFrom.authentication.entity.User;
import com.catringPlatFrom.authentication.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")

public class AuthController {

    private final UserService userService;

    private final RefreshTokenService refreshTokenService;

    private final JwtService jwtService;

    @PostMapping("/register")
    public ApiResponse<String> register(

            @Valid
            @RequestBody
            RegisterRequestDTO request
    ) {

        String response = userService.register(request);

        return ApiResponse.<String>builder()

                .success(true)

                .message("Registration Successful")

                .data(response)

                .build();
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponseDTO> login(

            @Valid
            @RequestBody
            LoginRequestDTO request
    ) {

        AuthResponseDTO response =
                userService.login(request);

        return ApiResponse.<AuthResponseDTO>builder()

                .success(true)

                .message("Login Successful")

                .data(response)

                .build();
    }

    @PostMapping("/refresh")
    public RefreshTokenResponseDTO refreshToken(

            @RequestBody
            RefreshTokenRequestDTO request
    ) {

        RefreshToken refreshToken =

                refreshTokenService.verifyRefreshToken(
                        request.getRefreshToken()
                );

        String accessToken =

                jwtService.generateToken(
                        refreshToken.getEmail()
                );

        return new RefreshTokenResponseDTO(

                accessToken,

                refreshToken.getToken()
        );
    }

    @GetMapping("/organizers")
    public ResponseEntity<List<User>> getOrganizers() {

        return ResponseEntity.ok(
                userService.getOrganizers()
        );
    }
}