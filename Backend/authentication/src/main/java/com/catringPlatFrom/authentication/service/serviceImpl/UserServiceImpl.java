package com.catringPlatFrom.authentication.service.serviceImpl;

import com.catringPlatFrom.authentication.dto.AuthResponseDTO;
import com.catringPlatFrom.authentication.dto.LoginRequestDTO;
import com.catringPlatFrom.authentication.dto.RegisterRequestDTO;

import com.catringPlatFrom.authentication.entity.User;
import com.catringPlatFrom.authentication.entity.RefreshToken;

import com.catringPlatFrom.authentication.enums.Role;

import com.catringPlatFrom.authentication.repository.UserRepository;

import com.catringPlatFrom.authentication.security.JwtService;

import com.catringPlatFrom.authentication.service.UserService;
import com.catringPlatFrom.authentication.service.RefreshTokenService;

import com.catringPlatFrom.authentication.exception.custom.EmailAlreadyExistsException;
import com.catringPlatFrom.authentication.exception.custom.InvalidPasswordException;
import com.catringPlatFrom.authentication.exception.custom.UserNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder;

    private final RefreshTokenService refreshTokenService;

    @Override
    public String register(RegisterRequestDTO request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new EmailAlreadyExistsException(
                    "Email already exists"
            );
        }

        User user = User.builder()

                .name(request.getName())

                .email(request.getEmail())

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .role(request.getRole())

                .build();

        userRepository.save(user);

        return "User Registered Successfully";
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())

                .orElseThrow(() ->

                        new UserNotFoundException(
                                "User not found"
                        ));

        boolean matches = passwordEncoder.matches(

                request.getPassword(),

                user.getPassword()
        );

        if (!matches) {

            throw new InvalidPasswordException(
                    "Invalid Password"
            );
        }

        String accessToken =

                jwtService.generateToken(user.getEmail());

        RefreshToken refreshToken =

                refreshTokenService.createRefreshToken(
                        user.getEmail()
                );

        return new AuthResponseDTO(

                accessToken,

                refreshToken.getToken(),

                user.getRole(),

                user.getEmail()
        );
    }

    @Override
    public List<User> getOrganizers() {

        return userRepository.findByRole("ORGANIZER");    }
}