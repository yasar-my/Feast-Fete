package com.catringPlatFrom.payment_service.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PaymentResponseDTO {

    private Long id;

    private Long bookingId;

    private String customerEmail;

    private Integer amount;

    private String paymentType;

    private String paymentStatus;

    private String transactionId;

    private String orderId;

    private String currency;

    private String key;


}