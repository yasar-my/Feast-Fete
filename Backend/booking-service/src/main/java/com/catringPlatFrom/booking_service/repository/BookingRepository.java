package com.catringPlatFrom.booking_service.repository;

import com.catringPlatFrom.booking_service.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerEmail(
            String customerEmail
    );

    List<Booking> findByOrganizerEmail(
            String organizerEmail
    );
}