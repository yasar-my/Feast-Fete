package com.catringPlatFrom.profile_service.service;

import com.catringPlatFrom.profile_service.dto.request.CustomerProfileRequestDTO;
import com.catringPlatFrom.profile_service.dto.response.CustomerProfileResponseDTO;

import java.util.List;

public interface CustomerProfileService {

    CustomerProfileResponseDTO createProfile(
            CustomerProfileRequestDTO request
    );

    CustomerProfileResponseDTO getProfileByEmail(
            String email
    );

    List<CustomerProfileResponseDTO> getAllProfiles();

    CustomerProfileResponseDTO updateProfile(
            Long id,
            CustomerProfileRequestDTO request
    );

    void deleteProfile(Long id);
}