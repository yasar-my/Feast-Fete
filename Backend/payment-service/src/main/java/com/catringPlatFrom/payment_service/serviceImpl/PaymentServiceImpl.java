package com.catringPlatFrom.payment_service.serviceImpl;

import com.catringPlatFrom.payment_service.dto.request.PaymentRequestDTO;
import com.catringPlatFrom.payment_service.dto.response.PaymentResponseDTO;
import com.catringPlatFrom.payment_service.entity.Payment;
import com.catringPlatFrom.payment_service.repository.PaymentRepository;
import com.catringPlatFrom.payment_service.service.PaymentService;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import lombok.RequiredArgsConstructor;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor

public class PaymentServiceImpl
        implements PaymentService {

    private final RazorpayClient razorpayClient;

    private final RestTemplate restTemplate;

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKey;

    @Override
    public PaymentResponseDTO createPayment(
            PaymentRequestDTO request
    ) {

        try {

            JSONObject options = new JSONObject();

            options.put(
                    "amount",
                    request.getAmount() * 100
            );

            options.put(
                    "currency",
                    "INR"
            );

            options.put(
                    "receipt",
                    "txn_" + System.currentTimeMillis()
            );

            Order order =
                    razorpayClient.orders.create(options);

            Payment payment = Payment.builder()
                    .bookingId(request.getBookingId())
                    .customerEmail(request.getCustomerEmail())
                    .amount(request.getAmount())
                    .paymentType(request.getPaymentType())
                    .paymentStatus("CREATED")
                    .transactionId(order.get("id"))
                    .build();

            Payment savedPayment =
                    paymentRepository.save(payment);

            return PaymentResponseDTO.builder()
                    .id(savedPayment.getId())
                    .bookingId(savedPayment.getBookingId())
                    .customerEmail(savedPayment.getCustomerEmail())
                    .amount(savedPayment.getAmount())
                    .paymentType(savedPayment.getPaymentType())
                    .paymentStatus(savedPayment.getPaymentStatus())
                    .transactionId(savedPayment.getTransactionId())
                    .orderId(order.get("id"))
                    .currency(order.get("currency"))
                    .key(razorpayKey)
                    .build();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error Creating Razorpay Order"
            );
        }
    }

    @Override
    public List<PaymentResponseDTO> getPaymentsByCustomer(
            String email
    ) {

        return paymentRepository
                .findByCustomerEmail(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponseDTO> getPaymentsByBooking(
            Long bookingId
    ) {

        return paymentRepository
                .findByBookingId(bookingId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PaymentResponseDTO mapToResponse(
            Payment payment
    ) {

        return PaymentResponseDTO.builder()
                .id(payment.getId())
                .bookingId(payment.getBookingId())
                .customerEmail(payment.getCustomerEmail())
                .amount(payment.getAmount())
                .paymentType(payment.getPaymentType())
                .paymentStatus(payment.getPaymentStatus())
                .transactionId(payment.getTransactionId())
                .build();
    }

    @Override
    public PaymentResponseDTO updatePaymentStatus(
            Long paymentId,
            String status
    ) {

        Payment payment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment Not Found"
                                )
                        );

        payment.setPaymentStatus(status);

        if(status.equals("SUCCESS")){

            updateAdvancePaid(
                    payment.getBookingId()
            );
        }

        Payment updatedPayment =
                paymentRepository.save(payment);

        return mapToResponse(updatedPayment);
    }

    @Override
    public List<PaymentResponseDTO> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public PaymentResponseDTO createOrder(
            PaymentRequestDTO request
    ) throws Exception {

        JSONObject options = new JSONObject();

        options.put(
                "amount",
                request.getAmount() * 100
        );

        options.put(
                "currency",
                "INR"
        );

        options.put(
                "receipt",
                "txn_" + System.currentTimeMillis()
        );

        Order order =
                razorpayClient.orders.create(options);

        return PaymentResponseDTO.builder()
                .bookingId(request.getBookingId())
                .customerEmail(request.getCustomerEmail())
                .amount(request.getAmount())
                .paymentType(request.getPaymentType())
                .paymentStatus("CREATED")
                .transactionId(order.get("id").toString())
                .orderId(order.get("id").toString())
                .currency(order.get("currency").toString())
                .key(razorpayKey)
                .build();
    }

    private void updateAdvancePaid(
            Long bookingId
    ) {

        String url =
                "http://localhost:8083/api/booking/advance-paid/"
                        + bookingId;

        restTemplate.put(
                url,
                null
        );
    }
}