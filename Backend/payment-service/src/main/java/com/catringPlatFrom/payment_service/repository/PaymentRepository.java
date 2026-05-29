package com.catringPlatFrom.payment_service.repository;

import com.catringPlatFrom.payment_service.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    List<Payment> findByCustomerEmail(
            String customerEmail
    );

    List<Payment> findByBookingId(
            Long bookingId
    );
}