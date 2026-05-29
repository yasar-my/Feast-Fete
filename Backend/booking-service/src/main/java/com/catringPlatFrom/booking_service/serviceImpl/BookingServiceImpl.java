package com.catringPlatFrom.booking_service.serviceImpl;

import com.catringPlatFrom.booking_service.dto.request.BookingRequestDTO;
import com.catringPlatFrom.booking_service.dto.response.BookingResponseDTO;
import com.catringPlatFrom.booking_service.entity.Booking;
import com.catringPlatFrom.booking_service.exception.ResourceNotFoundException;
import com.catringPlatFrom.booking_service.repository.BookingRepository;
import com.catringPlatFrom.booking_service.service.BookingService;

import com.catringPlatFrom.booking_service.entity.Booking;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor

public class BookingServiceImpl
        implements BookingService {

    private final BookingRepository repository;

    @Override
    public BookingResponseDTO createBooking(
            BookingRequestDTO request
    ) {

        Booking booking = Booking.builder()

                .customerEmail(
                        request.getCustomerEmail()
                )

                .organizerEmail(
                        request.getOrganizerEmail()
                )

                .customerName(
                        request.getCustomerName()
                )

                .customerMobile(
                        request.getCustomerMobile()
                )

                .customerAddress(
                        request.getCustomerAddress()
                )

                .eventDate(
                        request.getEventDate()
                )

                .mealType(
                        request.getMealType()
                )

                .guestCount(
                        request.getGuestCount()
                )

                .plateRate(
                        request.getPlateRate()
                )

                .totalAmount(
                        request.getTotalAmount()
                )

                .advanceAmount(
                        request.getAdvanceAmount()
                )

                .bookingStatus("PENDING")

                .createdAt(LocalDateTime.now())

                .build();

        Booking saved = repository.save(booking);

        return mapToDTO(saved);
    }

    @Override
    public List<BookingResponseDTO> getCustomerBookings(
            String customerEmail
    ) {

        return repository.findByCustomerEmail(
                        customerEmail
                )

                .stream()

                .map(this::mapToDTO)

                .toList();
    }

    @Override
    public List<BookingResponseDTO> getOrganizerBookings(
            String organizerEmail
    ) {

        return repository.findByOrganizerEmail(
                        organizerEmail
                )

                .stream()

                .map(this::mapToDTO)

                .toList();
    }

    @Override
    public BookingResponseDTO updateBookingStatus(
            Long id,
            String status
    ) {

        Booking booking = repository.findById(id)

                .orElseThrow(() ->

                        new ResourceNotFoundException(
                                "Booking not found"
                        )
                );

        booking.setBookingStatus(status);

        Booking updated = repository.save(booking);

        return mapToDTO(updated);
    }

    @Override
    public void cancelBooking(Long id) {

        repository.deleteById(id);
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {

        return repository.findAll()

                .stream()

                .map(this::mapToDTO)

                .toList();
    }

    @Override
    public Booking confirmBooking(
            Long bookingId
    ) {

        Booking booking = repository

                .findById(bookingId)

                .orElseThrow(() ->

                        new RuntimeException(
                                "Booking Not Found"
                        )
                );

        booking.setBookingStatus("CONFIRMED");

        return repository.save(booking);
    }

    private BookingResponseDTO mapToDTO(
            Booking booking
    ) {

        return BookingResponseDTO.builder()

                .id(
                        booking.getId()
                )

                .customerEmail(
                        booking.getCustomerEmail()
                )

                .organizerEmail(
                        booking.getOrganizerEmail()
                )

                .customerName(
                        booking.getCustomerName()
                )

                .customerMobile(
                        booking.getCustomerMobile()
                )

                .customerAddress(
                        booking.getCustomerAddress()
                )

                .eventDate(
                        booking.getEventDate()
                )

                .mealType(
                        booking.getMealType()
                )

                .guestCount(
                        booking.getGuestCount()
                )

                .plateRate(
                        booking.getPlateRate()
                )

                .totalAmount(
                        booking.getTotalAmount()
                )

                .advanceAmount(
                        booking.getAdvanceAmount()
                )

                .bookingStatus(
                        booking.getBookingStatus()
                )

                .build();
    }
}