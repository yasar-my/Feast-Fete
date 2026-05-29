package com.catringPlatFrom.profile_service.repository;

import com.catringPlatFrom.profile_service.entity.OrganizerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganizerProfileRepository
        extends JpaRepository<OrganizerProfile, Long> {

    Optional<OrganizerProfile> findByEmail(String email);
}