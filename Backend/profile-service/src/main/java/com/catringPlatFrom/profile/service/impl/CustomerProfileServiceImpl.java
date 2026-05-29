package com.catringPlatFrom.profile_service.serviceImpl;

import com.catringPlatFrom.profile_service.dto.request.CustomerProfileRequestDTO;
import com.catringPlatFrom.profile_service.dto.response.CustomerProfileResponseDTO;
import com.catringPlatFrom.profile_service.entity.CustomerProfile;
import com.catringPlatFrom.profile_service.repository.CustomerProfileRepository;
import com.catringPlatFrom.profile_service.service.CustomerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class CustomerProfileServiceImpl
        implements CustomerProfileService {

    private final CustomerProfileRepository repository;

    @Override
    public CustomerProfileResponseDTO createProfile(
            CustomerProfileRequestDTO request
    ) {

        CustomerProfile profile = CustomerProfile.builder()
                .name(request.getName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .profilePhoto(request.getProfilePhoto())
                .build();

        CustomerProfile savedProfile =
                repository.save(profile);

        return mapToResponse(savedProfile);
    }

    @Override
    public CustomerProfileResponseDTO getProfileByEmail(
            String email
    ) {

        CustomerProfile profile =
                repository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Profile not found"
                                ));

        return mapToResponse(profile);
    }

    @Override
    public java.util.List<CustomerProfileResponseDTO>
    getAllProfiles() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CustomerProfileResponseDTO updateProfile(
            Long id,
            CustomerProfileRequestDTO request
    ) {

        CustomerProfile profile =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Profile not found"
                                ));

        profile.setName(request.getName());
        profile.setEmail(request.getEmail());
        profile.setMobile(request.getMobile());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setPincode(request.getPincode());
        profile.setProfilePhoto(
                request.getProfilePhoto()
        );

        CustomerProfile updated =
                repository.save(profile);

        return mapToResponse(updated);
    }

    @Override
    public void deleteProfile(Long id) {

        repository.deleteById(id);
    }

    private CustomerProfileResponseDTO mapToResponse(
            CustomerProfile profile
    ) {

        return CustomerProfileResponseDTO.builder()
                .id(profile.getId())
                .name(profile.getName())
                .email(profile.getEmail())
                .mobile(profile.getMobile())
                .address(profile.getAddress())
                .city(profile.getCity())
                .state(profile.getState())
                .pincode(profile.getPincode())
                .profilePhoto(profile.getProfilePhoto())
                .build();
    }



}