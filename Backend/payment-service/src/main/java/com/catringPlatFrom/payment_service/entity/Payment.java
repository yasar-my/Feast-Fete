package com.catringPlatFrom.payment_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookingId;

    private String customerEmail;

    private Integer amount;

    private String paymentType;

    private String paymentStatus;

    private String transactionId;
}