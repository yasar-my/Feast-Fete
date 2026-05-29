package com.catringPlatFrom.payment_service.service;

import com.catringPlatFrom.payment_service.dto.request.PaymentRequestDTO;
import com.catringPlatFrom.payment_service.dto.response.PaymentResponseDTO;

import java.util.List;

public interface PaymentService {

    PaymentResponseDTO createPayment(
            PaymentRequestDTO request
    );

    List<PaymentResponseDTO> getPaymentsByCustomer(
            String email
    );

    List<PaymentResponseDTO> getPaymentsByBooking(
            Long bookingId
    );


    PaymentResponseDTO updatePaymentStatus(
            Long paymentId,
            String status
    );

    List<PaymentResponseDTO> getAllPayments();

    PaymentResponseDTO createOrder(
            PaymentRequestDTO request
    ) throws Exception;
}