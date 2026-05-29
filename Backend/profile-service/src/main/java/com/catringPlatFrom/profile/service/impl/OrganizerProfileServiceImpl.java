package com.catringPlatFrom.profile_service.service.impl;

import com.catringPlatFrom.profile_service.dto.request.OrganizerProfileRequestDTO;
import com.catringPlatFrom.profile_service.dto.response.OrganizerProfileResponseDTO;
import com.catringPlatFrom.profile_service.entity.OrganizerProfile;
import com.catringPlatFrom.profile_service.exception.ResourceNotFoundException;
import com.catringPlatFrom.profile_service.repository.OrganizerProfileRepository;
import com.catringPlatFrom.profile_service.service.OrganizerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class OrganizerProfileServiceImpl
        implements OrganizerProfileService {

    private final OrganizerProfileRepository repository;

    @Override
    public OrganizerProfileResponseDTO createProfile(
            OrganizerProfileRequestDTO request
    ) {

        OrganizerProfile organizer = new OrganizerProfile();

        organizer.setProfilePhoto(request.getProfilePhoto());
        organizer.setServiceName(request.getServiceName());
        organizer.setName(request.getName());
        organizer.setLocation(request.getLocation());
        organizer.setEmail(request.getEmail());
        organizer.setMobile(request.getMobile());
        organizer.setFoodType(request.getFoodType());
        organizer.setMinPeople(request.getMinPeople());
        organizer.setMaxPeople(request.getMaxPeople());
        organizer.setMenu(request.getMenu());
        organizer.setPlateRate(request.getPlateRate());

        OrganizerProfile saved =
                repository.save(organizer);

        OrganizerProfileResponseDTO response =
                new OrganizerProfileResponseDTO();

        response.setId(saved.getId());
        response.setProfilePhoto(saved.getProfilePhoto());
        response.setServiceName(saved.getServiceName());
        response.setName(saved.getName());
        response.setLocation(saved.getLocation());
        response.setEmail(saved.getEmail());
        response.setMobile(saved.getMobile());
        response.setFoodType(saved.getFoodType());
        response.setMinPeople(saved.getMinPeople());
        response.setMaxPeople(saved.getMaxPeople());
        response.setMenu(saved.getMenu());
        response.setPlateRate(saved.getPlateRate());

        return response;
    }

    @Override
    public OrganizerProfileResponseDTO getProfileByEmail(
            String email
    ) {

        OrganizerProfile profile = repository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Profile not found"
                        ));

        return mapToDTO(profile);
    }

    @Override
    public List<OrganizerProfileResponseDTO> getAllProfiles() {

        return repository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public OrganizerProfileResponseDTO updateProfile(
            Long id,
            OrganizerProfileRequestDTO request
    ) {

        OrganizerProfile profile = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Profile not found"
                        ));

        profile.setProfilePhoto(request.getProfilePhoto());
        profile.setServiceName(request.getServiceName());
        profile.setName(request.getName());
        profile.setLocation(request.getLocation());
        profile.setMobile(request.getMobile());
        profile.setFoodType(request.getFoodType());
        profile.setMinPeople(request.getMinPeople());
        profile.setMaxPeople(request.getMaxPeople());
        profile.setMenu(request.getMenu());
        profile.setPlateRate(request.getPlateRate());

        OrganizerProfile updated = repository.save(profile);

        return mapToDTO(updated);
    }

    @Override
    public void deleteProfile(Long id) {

        repository.deleteById(id);
    }

    private OrganizerProfileResponseDTO mapToDTO(
            OrganizerProfile profile
    ) {

        return OrganizerProfileResponseDTO.builder()
                .id(profile.getId())
                .profilePhoto(profile.getProfilePhoto())
                .serviceName(profile.getServiceName())
                .name(profile.getName())
                .location(profile.getLocation())
                .email(profile.getEmail())
                .mobile(profile.getMobile())
                .foodType(profile.getFoodType())
                .minPeople(profile.getMinPeople())
                .maxPeople(profile.getMaxPeople())
                .menu(profile.getMenu())
                .plateRate(profile.getPlateRate())
                .build();
    }
}