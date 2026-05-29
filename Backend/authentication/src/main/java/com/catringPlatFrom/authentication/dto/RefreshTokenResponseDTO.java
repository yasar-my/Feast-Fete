package com.catringPlatFrom.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class RefreshTokenResponseDTO {

    private String accessToken;

    private String refreshToken;
}