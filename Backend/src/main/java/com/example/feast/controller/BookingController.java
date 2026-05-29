

package com.example.feast.controller;

import com.example.feast.model.Booking;
import com.example.feast.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking/getbooking")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    @Autowired
    BookingService bookingService;

    @PostMapping("/create")
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.saveBooking(booking);
    }
    @GetMapping("/customer-orders")
    public List<Booking> getCustomerOrders(@RequestParam String email) {
        return bookingService.getCustomerOrders(email);
    }
    @GetMapping("/caterer-orders")
    public List<Booking> getCatererOrders(@RequestParam String email) {
        return bookingService.getBookingsByCatererEmail(email);
    }
    @PutMapping("/update-status")
    public Booking updateBookingStatus(@RequestParam Long id, @RequestParam String status) {
        return bookingService.updateBookingStatus(id, status);
    }
    @GetMapping("/getbooking")
    public List<Booking> getbooking() {
        return bookingService.getbooking();
    }
}
