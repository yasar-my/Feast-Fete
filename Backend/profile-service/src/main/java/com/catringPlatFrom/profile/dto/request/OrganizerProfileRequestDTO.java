package com.catringPlatFrom.profile_service.dto.request;

import lombok.Data;

@Data
public class OrganizerProfileRequestDTO {

    private String profilePhoto;
    private String serviceName;
    private String name;
    private String location;
    private String email;
    private String mobile;
    private String foodType;
    private Integer minPeople;
    private Integer maxPeople;
    private String menu;
    private Integer plateRate;
}