package com.catringPlatFrom.booking_service.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class BookingResponseDTO {

    private Long id;

    private String customerEmail;

    private String organizerEmail;

    private String customerName;

    private String customerMobile;

    private String customerAddress;

    private LocalDate eventDate;

    private String mealType;

    private Integer guestCount;

    private Integer plateRate;

    private Integer totalAmount;

    private Integer advanceAmount;

    private String bookingStatus;

    private Boolean advancePaid;
}