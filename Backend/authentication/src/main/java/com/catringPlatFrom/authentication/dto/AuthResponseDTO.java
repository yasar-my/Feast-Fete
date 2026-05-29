package com.catringPlatFrom.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class AuthResponseDTO {

    private String accessToken;

    private String refreshToken;

    private String role;

    private String email;
}