package com.catringPlatFrom.booking_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    private LocalDateTime createdAt;

}