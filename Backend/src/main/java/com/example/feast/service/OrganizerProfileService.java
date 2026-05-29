package com.example.feast.service;

import com.example.feast.model.OrganizerProfile;
import com.example.feast.repository.OrganizerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrganizerProfileService {

    @Autowired
    private OrganizerProfileRepository repo;

    public OrganizerProfile registerOrganizer(OrganizerProfile organizer) {
        return repo.save(organizer);
    }

    public OrganizerProfile getProfileByEmail(String email) {
        return repo.findByEmail(email);
    }

    public OrganizerProfile saveOrUpdateProfile(OrganizerProfile profile) {
        if (profile.getId() != null) {
            Optional<OrganizerProfile> existingOpt = repo.findById(profile.getId());
            if (existingOpt.isPresent()) {
                OrganizerProfile existing = existingOpt.get();
                copyProfileFields(existing, profile);
                return repo.save(existing);
            }
        } else if (profile.getEmail() != null && !profile.getEmail().isEmpty()) {
            OrganizerProfile existing = repo.findByEmail(profile.getEmail());
            if (existing != null) {
                profile.setId(existing.getId());
                copyProfileFields(existing, profile);
                return repo.save(existing);
            }
        }
        return repo.save(profile);
    }

    private void copyProfileFields(OrganizerProfile target, OrganizerProfile source) {
        target.setProfilePhoto(source.getProfilePhoto());
        target.setServiceName(source.getServiceName());
        target.setName(source.getName());
        target.setLocation(source.getLocation());
        target.setEmail(source.getEmail());
        target.setMobile(source.getMobile());
        target.setFoodType(source.getFoodType());
        target.setMinPeople(source.getMinPeople());
        target.setMaxPeople(source.getMaxPeople());
        target.setMenu(source.getMenu());
    }
    public List<OrganizerProfile> getAllProfiles() {
        return repo.findAll();
    }

    public OrganizerProfile getProfileById(Long id) {
        return repo.findById(id).orElse(null);
    }
    public boolean authenticate(String email, String rawPassword) {
        OrganizerProfile organizer = repo.findByEmail(email);
        if (organizer != null) {
            return organizer.getPassword().equals(rawPassword);
        }
        return false;
    }
    public void deleteOrganizer(Long id) {
        repo.deleteById(id);
    }
}
