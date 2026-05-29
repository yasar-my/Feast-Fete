package com.catringPlatFrom.profile_service.repository;

import com.catringPlatFrom.profile_service.entity.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerProfileRepository
        extends JpaRepository<CustomerProfile, Long> {

    Optional<CustomerProfile> findByEmail(String email);
}