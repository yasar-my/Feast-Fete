import { useEffect, useState } from "react";

const BookingRequests = () => {

    const API3 = import.meta.env.VITE_BOOKING_URL;

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const organizerEmail =
        localStorage.getItem("email");

    useEffect(() => {

        fetch(
            `${API3}/api/booking/organizer/${organizerEmail}`
        )
            .then((res) => res.json())
            .then((data) => {

                setRequests(data);
                setLoading(false);

            })
            .catch((err) => {

                console.log(err);
                setLoading(false);

            });

    }, [organizerEmail]);

    // CONFIRM BOOKING
    const confirmBooking = async (id) => {

        try {

            await fetch(
                `${API3}/api/booking/confirm/${id}`,
                {
                    method: "PUT"
                }
            );

            setRequests((prev) =>
                prev.map((booking) =>
                    booking.id === id
                        ? {
                              ...booking,
                              bookingStatus:
                                  "CONFIRMED"
                          }
                        : booking
                )
            );

        } catch (error) {

            console.log(error);

        }
    };

    const cancelBooking = async (id) => {

    try {

        await fetch(
            `${API3}/api/booking/cancel/${id}`,
            {
                method: "PUT"
            }
        );

        setRequests((prev) =>
            prev.map((booking) =>
                booking.id === id
                    ? {
                          ...booking,
                          bookingStatus:
                              "CANCELLED"
                      }
                    : booking
            )
        );

    } catch (error) {

        console.log(error);

    }
};

    // STATUS COLOR
    const getStatusColor = (status) => {

    if (status === "PENDING")
        return "#f59e0b";

    if (status === "CONFIRMED")
        return "#16a34a";

    if (status === "COMPLETED")
        return "#2563eb";

    if (status === "CANCELLED")
        return "#dc2626";

    return "#6b7280";
};

    if (loading) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "30px"
                }}
            >
                Loading Requests...
            </div>
        );
    }

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f8f5f0",
                padding: "50px 8%"
            }}
        >

            {/* TITLE */}
            <div
                style={{
                    marginBottom: "40px"
                }}
            >

                <h1
                    style={{
                        fontSize: "55px",
                        color: "#2b1408"
                    }}
                >
                    Booking Requests
                </h1>

                <p
                    style={{
                        color: "#777",
                        marginTop: "10px"
                    }}
                >
                    Manage customer bookings
                </p>

            </div>

            {
                requests.length === 0 && (

                    <div
                        style={{
                            textAlign: "center",
                            fontSize: "30px",
                            marginTop: "100px"
                        }}
                    >
                        No Booking Requests Found
                    </div>

                )
            }

            <div
                style={{
                    display: "grid",
                    gap: "25px"
                }}
            >

                {
                    requests.map((booking) => (

                        <div
                            key={booking.id}
                            style={{
                                background: "#fff",
                                padding: "35px",
                                borderRadius: "25px",
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.08)"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "20px"
                                }}
                            >

                                {/* LEFT */}
                                <div>

                                    <h2
                                        style={{
                                            color:
                                                "#2b1408",
                                            marginBottom:
                                                "15px"
                                        }}
                                    >
                                        {
                                            booking.customerName
                                        }
                                    </h2>

                                    <p>
                                        📧{" "}
                                        {
                                            booking.customerEmail
                                        }
                                    </p>

                                    <p>
                                        📞{" "}
                                        {
                                            booking.customerMobile
                                        }
                                    </p>

                                    <p>
                                        📅{" "}
                                        {
                                            booking.eventDate
                                        }
                                    </p>

                                    <p>
                                        🍽{" "}
                                        {
                                            booking.mealType
                                        }
                                    </p>

                                    <p>
                                        👥{" "}
                                        {
                                            booking.guestCount
                                        }{" "}
                                        Guests
                                    </p>

                                    <p>
                                        💰 ₹{" "}
                                        {
                                            booking.totalAmount
                                        }
                                    </p>

                                </div>

                                {/* RIGHT */}
                                <div>

                                    <span
                                        style={{
                                            background:
                                                getStatusColor(
                                                    booking.bookingStatus
                                                ),
                                            color: "#fff",
                                            padding:
                                                "10px 20px",
                                            borderRadius:
                                                "30px",
                                            fontWeight:
                                                "600"
                                        }}
                                    >
                                        {
                                            booking.bookingStatus
                                        }
                                    </span>

                                </div>

                            </div>

                            {/* BUTTONS */}

                            {
                                booking.bookingStatus === "PENDING" && (

                                    <div
                                        style={{
                                            marginTop: "20px",
                                            display: "flex",
                                            gap: "10px"
                                        }}
                                    >

                                        <button
                                            onClick={() =>
                                                confirmBooking(
                                                    booking.id
                                                )
                                            }
                                            style={{
                                                background: "#16a34a",
                                                color: "#fff",
                                                border: "none",
                                                padding: "12px 24px",
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Confirm Booking
                                        </button>

                                        <button
                                            onClick={() =>
                                                cancelBooking(
                                                    booking.id
                                                )
                                            }
                                            style={{
                                                background: "#dc2626",
                                                color: "#fff",
                                                border: "none",
                                                padding: "12px 24px",
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Cancel Booking
                                        </button>

                                    </div>

                                )
                            }

                            {
                                booking.bookingStatus ===
                                    "CONFIRMED" && (

                                    <div
                                        style={{
                                            marginTop:
                                                "20px",
                                            color:
                                                "#16a34a",
                                            fontWeight:
                                                "600"
                                        }}
                                    >
                                        ✅ Booking Confirmed
                                    </div>

                                )
                            }

                            

                            {
                                booking.bookingStatus ===
                                    "COMPLETED" && (

                                    <div
                                        style={{
                                            marginTop:
                                                "20px",
                                            color:
                                                "#2563eb",
                                            fontWeight:
                                                "600"
                                        }}
                                    >
                                        🎉 Event Completed
                                    </div>

                                )
                            }
                            {
                                booking.bookingStatus ===
                                    "CANCELLED" && (

                                    <div
                                        style={{
                                            marginTop: "20px",
                                            color: "#dc2626",
                                            fontWeight: "600"
                                        }}
                                    >
                                        ❌ Booking Cancelled
                                    </div>

                                )
                            }

                        </div>

                    ))
                }

            </div>

        </div>

    );
};

export default BookingRequests;