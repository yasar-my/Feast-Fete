

package com.example.feast.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "catererEmail")
    private String catererEmail;

    @Column(name = "customerAddress")
    private String customerAddress;

    @Column(name = "customerEmail")
    private String customerEmail;

    @Column(name = "customerLocation")
    private String customerLocation;

    @Column(name = "customerMobile")
    private String customerMobile;

    @Column(name = "customerName")
    private String customerName;

    @Column(name = "numberOfPeople")
    private int numberOfPeople;

    @Column(name = "plateRate")
    private int plateRate;

    @Column(name = "status")
    private String status;

    @Column(name = "totalAmount")
    private int totalAmount;

    @Column(name = "advance_amount")
    private int advanceAmount;

    @Column(name = "booking_date")
    private String bookingDate;

    @Column(name = "meal_times")
    private String mealTimes;
}
