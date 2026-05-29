

package com.example.feast.service;

import com.example.feast.model.Booking;
import com.example.feast.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {
    @Autowired
    BookingRepository bookingRepository;

    public Booking saveBooking(Booking booking) {
        booking.setStatus("pending"); // default
        return bookingRepository.save(booking);
    }
    public List<Booking> getCustomerOrders(String email) {
        return bookingRepository.findByCustomerEmail(email);
    }
    public List<Booking> getBookingsByCatererEmail(String catererEmail) {
        return bookingRepository.findByCatererEmail(catererEmail);
    }
    public Booking updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }
        return null;
    }

    public List<Booking> getbooking() {
        return bookingRepository.findAll();
    }
}