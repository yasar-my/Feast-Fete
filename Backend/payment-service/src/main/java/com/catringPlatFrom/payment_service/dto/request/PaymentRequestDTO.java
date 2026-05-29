package com.catringPlatFrom.payment_service.dto.request;

import lombok.Data;

@Data

public class PaymentRequestDTO {

    private Long bookingId;

    private String customerEmail;

    private Integer amount;

    private String paymentType;
}