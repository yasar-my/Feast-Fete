package com.catringPlatFrom.booking_service.service;

import com.catringPlatFrom.booking_service.dto.request.BookingRequestDTO;
import com.catringPlatFrom.booking_service.dto.response.BookingResponseDTO;
import com.catringPlatFrom.booking_service.entity.Booking;

import java.util.List;

public interface BookingService {

    BookingResponseDTO createBooking(
            BookingRequestDTO request
    );

    List<BookingResponseDTO> getCustomerBookings(
            String customerEmail
    );

    List<BookingResponseDTO> getOrganizerBookings(
            String organizerEmail
    );

    BookingResponseDTO updateBookingStatus(
            Long id,
            String status
    );

    void cancelBooking(
            Long id
    );

    List<BookingResponseDTO> getAllBookings();

    Booking confirmBooking(
            Long bookingId
    );
    Booking completeBooking(
            Long bookingId
    );
    Booking advancePaid(
            Long bookingId
    );
    byte[] generateInvoice(Long bookingId);
}