package com.catringPlatFrom.payment_service.dto.request;

import lombok.Data;

@Data
public class PaymentStatusDTO {

    private Long paymentId;

    private String status;

    private String transactionId;
}