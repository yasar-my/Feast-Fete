package com.catringPlatFrom.profile_service.dto.request;

import lombok.Data;

@Data

public class CustomerProfileRequestDTO {

    private String name;
    private String email;
    private String mobile;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String profilePhoto;
}