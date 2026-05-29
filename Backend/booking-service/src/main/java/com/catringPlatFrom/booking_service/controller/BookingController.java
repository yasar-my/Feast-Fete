package com.catringPlatFrom.booking_service.controller;

import com.catringPlatFrom.booking_service.dto.request.BookingRequestDTO;
import com.catringPlatFrom.booking_service.dto.response.BookingResponseDTO;
import com.catringPlatFrom.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

import com.catringPlatFrom.booking_service.entity.Booking;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
@CrossOrigin("*")

public class BookingController {

    private final BookingService service;

    @PostMapping("/create")
    public BookingResponseDTO createBooking(
            @Valid @RequestBody BookingRequestDTO request
    ) {

        return service.createBooking(request);
    }

    @GetMapping("/customer/{email}")
    public List<BookingResponseDTO> getCustomerBookings(
            @PathVariable String email
    ) {

        return service.getCustomerBookings(email);
    }

    @GetMapping("/organizer/{email}")
    public List<BookingResponseDTO> getOrganizerBookings(
            @PathVariable String email
    ) {

        return service.getOrganizerBookings(email);
    }

    @PutMapping("/{id}/{status}")
    public BookingResponseDTO updateBookingStatus(
            @PathVariable Long id,
            @PathVariable String status
    ) {

        return service.updateBookingStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public String cancelBooking(
            @PathVariable Long id
    ) {

        service.cancelBooking(id);

        return "Booking Cancelled Successfully";
    }



    @GetMapping("/all")
    public List<BookingResponseDTO> getAllBookings() {

        return service.getAllBookings();
    }


    @PutMapping("/confirm/{bookingId}")
    public Booking confirmBooking(
            @PathVariable Long bookingId
    ) {

        return service.confirmBooking(bookingId);
    }
}