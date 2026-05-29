package com.catringPlatFrom.booking_service.dto.request;

import lombok.Data;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data

public class BookingRequestDTO {

    @NotBlank
    private String customerEmail;

    private String organizerEmail;

    @NotBlank
    private String customerName;

    private String customerMobile;

    private String customerAddress;

    private LocalDate eventDate;

    private String mealType;

    @NotNull
    private Integer guestCount;

    private Integer plateRate;

    private Integer totalAmount;

    private Integer advanceAmount;
}
