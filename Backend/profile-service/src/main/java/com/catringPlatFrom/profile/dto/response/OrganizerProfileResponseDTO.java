package com.catringPlatFrom.profile_service.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class OrganizerProfileResponseDTO {

    private Long id;
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