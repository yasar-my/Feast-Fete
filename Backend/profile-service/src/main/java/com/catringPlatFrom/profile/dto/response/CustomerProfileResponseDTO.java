package com.catringPlatFrom.profile_service.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CustomerProfileResponseDTO {

    private Long id;

    private String name;

    private String email;

    private String mobile;

    private String address;

    private String city;

    private String state;

    private String pincode;

    private String profilePhoto;
}