import { useEffect, useState } from "react";

const BookingRequests = () => {

    const API3 = import.meta.env.VITE_BOOKING_URL;

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [justUpdated, setJustUpdated] = useState(null);

    const organizerEmail =
        localStorage.getItem("email");

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(t);
    }, []);

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

    const flash = (id) => {
        setJustUpdated(id);
        setTimeout(() => setJustUpdated(null), 900);
    };

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

            flash(id);

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

        flash(id);

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
                    flexDirection: "column",
                    gap: "18px",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#f8f5f0",
                }}
            >
                <style>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                    .loader-ring {
                        width: 54px;
                        height: 54px;
                        border: 4px solid #e7ddcd;
                        border-top-color: #2b1408;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                    }
                `}</style>
                <div className="loader-ring" />
                <p style={{ fontSize: "22px", color: "#2b1408", fontFamily: "'Cormorant Garamond', serif" }}>
                    Loading Requests...
                </p>
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
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-18px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.85); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes flashGlow {
                    0% { box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
                    35% { box-shadow: 0 0 0 6px rgba(22,163,74,0.18), 0 10px 25px rgba(0,0,0,0.08); }
                    100% { box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
                }

                .booking-card {
                    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
                }
                .booking-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 38px rgba(0,0,0,0.12);
                }
                .booking-card.flash {
                    animation: flashGlow 0.9s ease;
                }

                .status-badge { transition: background 0.4s ease, transform 0.3s ease; }

                .action-btn {
                    transition: transform 0.25s ease, filter 0.25s ease, box-shadow 0.25s ease;
                }
                .action-btn:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.18);
                }
                .action-btn:active {
                    transform: translateY(0) scale(0.96);
                }

                .status-message { animation: popIn 0.4s cubic-bezier(0.22,1,0.36,1); }

                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.001ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.001ms !important;
                    }
                }
            `}</style>

            {/* TITLE */}
            <div
                style={{
                    marginBottom: "40px",
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(-18px)",
                    transition: "opacity 0.55s ease, transform 0.55s ease",
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
                            marginTop: "100px",
                            animation: "popIn 0.5s ease",
                        }}
                    >
                        <div style={{ fontSize: "46px", marginBottom: "14px" }}>📭</div>
                        <div style={{ fontSize: "26px", color: "#2b1408" }}>
                            No Booking Requests Found
                        </div>
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
                    requests.map((booking, index) => (

                        <div
                            key={booking.id}
                            className={`booking-card${justUpdated === booking.id ? " flash" : ""}`}
                            style={{
                                background: "#fff",
                                padding: "35px",
                                borderRadius: "25px",
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.08)",
                                animation: `cardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${Math.min(index * 0.08, 0.6)}s both`,
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
                                        className="status-badge"
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
                                                "600",
                                            display: "inline-block",
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
                                            className="action-btn"
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
                                            className="action-btn"
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
                                        className="status-message"
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
                                        className="status-message"
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
                                        className="status-message"
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
