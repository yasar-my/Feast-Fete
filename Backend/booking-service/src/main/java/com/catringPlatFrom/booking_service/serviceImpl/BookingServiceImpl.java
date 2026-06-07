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

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;

import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Element;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPCell;

import com.itextpdf.text.Image;
import java.net.URL;

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

                .advancePaid(false)

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
                .advancePaid(
                        booking.getAdvancePaid()
                )

                .build();
    }

    @Override
    public Booking completeBooking(
            Long bookingId
    ) {

        Booking booking = repository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking Not Found"
                        )
                );

        booking.setBookingStatus("COMPLETED");

        return repository.save(booking);
    }

    @Override
    public Booking advancePaid(
            Long bookingId
    ) {

        Booking booking =
                repository.findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking Not Found"
                                )
                        );

        booking.setAdvancePaid(true);

        return repository.save(booking);
    }

    @Override
    public void cancelBooking(Long bookingId) {

        try {

            Booking booking = repository
                    .findById(bookingId)
                    .orElseThrow(() ->
                            new RuntimeException("Booking Not Found"));

            System.out.println("Before: " +
                    booking.getBookingStatus());

            booking.setBookingStatus("CANCELLED");

            repository.save(booking);

            System.out.println("After Save");

        } catch (Exception e) {

            e.printStackTrace();

            throw e;
        }
    }

    @Override
    public byte[] generateInvoice(Long bookingId) {

        Booking booking = repository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking Not Found"));

        try {

            ByteArrayOutputStream output =
                    new ByteArrayOutputStream();

            Document document =
                    new Document();

            PdfWriter.getInstance(
                    document,
                    output
            );

            document.open();

            URL logoUrl =
                    getClass()
                            .getResource("/static/logo.jpeg");

            if (logoUrl != null) {

                Image logo =
                        Image.getInstance(logoUrl);

                logo.scaleToFit(100, 100);

                logo.setAlignment(
                        Image.ALIGN_CENTER
                );

                document.add(logo);
            }

            Font titleFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            22
                    );

            Font headerFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA_BOLD,
                            14
                    );

            Font normalFont =
                    FontFactory.getFont(
                            FontFactory.HELVETICA,
                            12
                    );

            Paragraph title =
                    new Paragraph(
                            "FEAST & FETE CATERING SERVICES",
                            titleFont
                    );

            title.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(title);

            document.add(
                    new Paragraph(" ")
            );

            Paragraph invoiceTitle =
                    new Paragraph(
                            "BOOKING INVOICE",
                            headerFont
                    );

            invoiceTitle.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(invoiceTitle);

            document.add(
                    new Paragraph(" ")
            );

            String invoiceNumber =
                    "INV-" + (1000 + booking.getId());

            document.add(
                    new Paragraph(
                            "Invoice No : "
                                    + invoiceNumber
                    )
            );

            document.add(
                    new Paragraph(
                            "Generated On : "
                                    + LocalDateTime.now()
                    )
            );

            document.add(
                    new Paragraph(" ")
            );

            PdfPTable customerTable =
                    new PdfPTable(2);

            customerTable.setWidthPercentage(100);

            customerTable.addCell("Booking ID");
            customerTable.addCell(
                    String.valueOf(
                            booking.getId()
                    )
            );

            customerTable.addCell("Customer Name");
            customerTable.addCell(
                    booking.getCustomerName()
            );

            customerTable.addCell("Customer Email");
            customerTable.addCell(
                    booking.getCustomerEmail()
            );



            customerTable.addCell("Event Date");
            customerTable.addCell(
                    booking.getEventDate().toString()
            );

            document.add(customerTable);

            document.add(
                    new Paragraph(" ")
            );

            PdfPTable bookingTable =
                    new PdfPTable(2);

            bookingTable.setWidthPercentage(100);

            bookingTable.addCell("Meal Type");
            bookingTable.addCell(
                    booking.getMealType()
            );

            bookingTable.addCell("Guests");
            bookingTable.addCell(
                    String.valueOf(
                            booking.getGuestCount()
                    )
            );

            bookingTable.addCell("Advance Paid");
            bookingTable.addCell(
                    "₹" + booking.getAdvanceAmount()
            );

            bookingTable.addCell("Total Amount");
            bookingTable.addCell(
                    "₹" + booking.getTotalAmount()
            );

            bookingTable.addCell("Status");
            bookingTable.addCell(
                    booking.getBookingStatus()
            );
            bookingTable.addCell(
                    "Organizer Email"
            );

            bookingTable.addCell(
                    booking.getOrganizerEmail()
            );

            document.add(bookingTable);

            document.add(
                    new Paragraph(" ")
            );

            document.add(
                    new Paragraph("--------------------")
            );

            document.add(
                    new Paragraph(
                            "Booking ID : " +
                                    booking.getId()
                    )
            );

            document.add(
                    new Paragraph(
                            "Customer Name : " +
                                    booking.getCustomerName()
                    )
            );

            document.add(
                    new Paragraph(
                            "Event Date : " +
                                    booking.getEventDate()
                    )
            );

            document.add(
                    new Paragraph(
                            "Guests : " +
                                    booking.getGuestCount()
                    )
            );

            document.add(
                    new Paragraph(
                            "Advance Paid : ₹" +
                                    booking.getAdvanceAmount()
                    )
            );

            document.add(
                    new Paragraph(
                            "Total Amount : ₹" +
                                    booking.getTotalAmount()
                    )
            );

            Paragraph footer =
                    new Paragraph(
                            "Thank You For Choosing Feast & Fete",
                            headerFont
                    );

            footer.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(footer);

            document.close();

            return output.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invoice Generation Failed"
            );
        }
    }
}