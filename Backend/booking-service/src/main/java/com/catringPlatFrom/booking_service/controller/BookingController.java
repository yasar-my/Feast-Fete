package com.catringPlatFrom.booking_service.controller;

import com.catringPlatFrom.booking_service.dto.request.BookingRequestDTO;
import com.catringPlatFrom.booking_service.dto.response.BookingResponseDTO;
import com.catringPlatFrom.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

import com.catringPlatFrom.booking_service.entity.Booking;
import org.springframework.http.ResponseEntity;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

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

    @PutMapping("/cancel/{id}")
    public ResponseEntity<String> cancelBooking(
            @PathVariable Long id) {

        service.cancelBooking(id);

        return ResponseEntity.ok("Booking Cancelled");
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
    @PutMapping("/complete/{bookingId}")
    public Booking completeBooking(
            @PathVariable Long bookingId
    ) {

        return service.completeBooking(
                bookingId
        );
    }

    @PutMapping("/advance-paid/{bookingId}")
    public Booking advancePaid(
            @PathVariable Long bookingId
    ) {

        return service.advancePaid(
                bookingId
        );
    }

    @GetMapping("/invoice/{id}")
    public ResponseEntity<byte[]> downloadInvoice(
            @PathVariable Long id
    ) {

        byte[] pdf =
                service.generateInvoice(id);

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice.pdf"
                )

                .contentType(
                        MediaType.APPLICATION_PDF
                )

                .body(pdf);
    }
}
