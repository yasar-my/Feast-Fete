package com.catringPlatFrom.profile_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organizer_profiles")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class OrganizerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String profilePhoto;

    private String serviceName;

    private String name;

    private String location;

    @Column(unique = true)
    private String email;

    private String mobile;

    private String foodType;

    private Integer minPeople;

    private Integer maxPeople;

    @Column(length = 5000)
    private String menu;

    private Integer plateRate;
}