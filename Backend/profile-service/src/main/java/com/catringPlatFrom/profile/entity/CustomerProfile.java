package com.catringPlatFrom.profile_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customer_profiles")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CustomerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String mobile;

    private String address;

    private String city;

    private String state;

    private String pincode;

    private String profilePhoto;
}