package com.catringPlatFrom.payment_service.controller;

import com.catringPlatFrom.payment_service.dto.request.PaymentRequestDTO;
import com.catringPlatFrom.payment_service.dto.request.PaymentStatusDTO;
import com.catringPlatFrom.payment_service.dto.response.PaymentResponseDTO;
import com.catringPlatFrom.payment_service.service.PaymentService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")

public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public PaymentResponseDTO createPayment(
            @RequestBody PaymentRequestDTO request
    ) {

        return paymentService.createPayment(request);
    }

    @PostMapping("/create-order")
    public PaymentResponseDTO createOrder(
            @RequestBody PaymentRequestDTO request
    ) throws Exception {

        return paymentService.createOrder(request);
    }

    @PutMapping("/update-status")
    public PaymentResponseDTO updatePaymentStatus(
            @RequestBody PaymentStatusDTO request
    ) {

        return paymentService.updatePaymentStatus(
                request.getPaymentId(),
                request.getStatus()
        );
    }

    @GetMapping("/customer/{email}")
    public List<PaymentResponseDTO> getPaymentsByCustomer(
            @PathVariable String email
    ) {

        return paymentService
                .getPaymentsByCustomer(email);
    }

    @GetMapping("/booking/{bookingId}")
    public List<PaymentResponseDTO> getPaymentsByBooking(
            @PathVariable Long bookingId
    ) {

        return paymentService
                .getPaymentsByBooking(bookingId);
    }

    @GetMapping("/all")
    public List<PaymentResponseDTO> getAllPayments() {

        return paymentService.getAllPayments();
    }
}