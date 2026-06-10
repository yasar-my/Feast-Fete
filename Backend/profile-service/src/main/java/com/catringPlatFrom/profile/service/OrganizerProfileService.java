package com.catringPlatFrom.profile_service.service;

import com.catringPlatFrom.profile_service.dto.request.OrganizerProfileRequestDTO;
import com.catringPlatFrom.profile_service.dto.response.OrganizerProfileResponseDTO;

import java.util.List;

public interface OrganizerProfileService {

    OrganizerProfileResponseDTO createProfile(
            OrganizerProfileRequestDTO request
    );

    OrganizerProfileResponseDTO getProfileByEmail(
            String email
    );

    List<OrganizerProfileResponseDTO> getAllProfiles();

    OrganizerProfileResponseDTO updateProfile(
            Long id,
            OrganizerProfileRequestDTO request
    );

    void deleteProfile(Long id);

    void deleteProfileByEmail(String email);

    void deleteAllProfiles();
}