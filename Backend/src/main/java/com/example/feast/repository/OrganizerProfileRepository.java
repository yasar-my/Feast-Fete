package com.example.feast.repository;

import com.example.feast.model.OrganizerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizerProfileRepository extends JpaRepository<OrganizerProfile, Long> {
    OrganizerProfile findByEmail(String email);
}
