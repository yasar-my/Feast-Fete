package com.catringPlatFrom.authentication.service;

import com.catringPlatFrom.authentication.entity.RefreshToken;
import com.catringPlatFrom.authentication.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken createRefreshToken(
            String email
    ) {

        RefreshToken refreshToken =
                RefreshToken.builder()

                        .token(UUID.randomUUID().toString())

                        .email(email)

                        .expiryDate(
                                LocalDateTime.now().plusDays(7)
                        )

                        .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyRefreshToken(
            String token
    ) {

        RefreshToken refreshToken =
                refreshTokenRepository.findByToken(token)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid Refresh Token"
                                ));

        if (refreshToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Refresh Token Expired"
            );
        }

        return refreshToken;
    }
}