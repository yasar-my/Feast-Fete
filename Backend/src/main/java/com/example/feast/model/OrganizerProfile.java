package com.example.feast.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "organizer_profile")
public class OrganizerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String profilePhoto;
    private String serviceName;
    private String name;
    private String location;
    private String email;
    private String mobile;
    private String foodType;
    private int minPeople;
    private int maxPeople;
    private String menu;
    private int plateRate;
    @Column(name = "password")
    private String password;

}
