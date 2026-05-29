import { useEffect, useState } from "react";

const MyBookings = () => {

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const customerEmail = localStorage.getItem("email");

    useEffect(() => {

        fetch(
            `http://localhost:8083/api/booking/customer/${customerEmail}`
        )

            .then((res) => {

                if (!res.ok) {
                    throw new Error("Failed to fetch bookings");
                }

                return res.json();
            })

            .then((data) => {

                console.log(data);

                setBookings(data);

                setLoading(false);
            })

            .catch((err) => {

                console.log(err);

                setError("Unable to load bookings");

                setLoading(false);
            });

    }, [customerEmail]);

    // LOADING
    if (loading) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "24px"
                }}
            >
                Loading Bookings...
            </div>
        );
    }

    // ERROR
    if (error) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "red",
                    fontSize: "24px"
                }}
            >
                {error}
            </div>
        );
    }

    // EMPTY
    if (bookings.length === 0) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "28px"
                }}
            >
                No Bookings Found
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
                        fontSize: "52px",
                        color: "#2b1408"
                    }}
                >
                    My Bookings
                </h1>

                <p
                    style={{
                        color: "#666",
                        marginTop: "10px"
                    }}
                >
                    Your Catering Booking History
                </p>

            </div>

            {/* BOOKINGS */}
            <div
                style={{
                    display: "grid",
                    gap: "30px"
                }}
            >

                {
                    bookings.map((booking) => (

                        <div
                            key={booking.id}
                            style={{
                                background: "#fff",
                                padding: "35px",
                                borderRadius: "24px",
                                boxShadow:
                                    "0 10px 30px rgba(0,0,0,0.08)"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "20px"
                                }}
                            >

                                <div>

                                    <h2
                                        style={{
                                            color: "#2b1408",
                                            marginBottom: "12px"
                                        }}
                                    >
                                        {booking.organizerEmail}
                                    </h2>

                                    <p
                                        style={{
                                            marginBottom: "8px"
                                        }}
                                    >
                                        📅 Event Date :
                                        {" "}
                                        {booking.eventDate}
                                    </p>

                                    <p
                                        style={{
                                            marginBottom: "8px"
                                        }}
                                    >
                                        🍽 Meal Type :
                                        {" "}
                                        {booking.mealType}
                                    </p>

                                    <p
                                        style={{
                                            marginBottom: "8px"
                                        }}
                                    >
                                        👥 Guests :
                                        {" "}
                                        {booking.guestCount}
                                    </p>

                                    <p
                                        style={{
                                            marginBottom: "8px"
                                        }}
                                    >
                                        💰 Total :
                                        {" "}
                                        ₹ {booking.totalAmount}
                                    </p>

                                    <p
                                        style={{
                                            marginBottom: "8px"
                                        }}
                                    >
                                        💵 Advance :
                                        {" "}
                                        ₹ {booking.advanceAmount}
                                    </p>

                                </div>

                                {/* STATUS */}
                                <div>

                                    <span
                                        style={{
                                            padding:
                                                "10px 18px",

                                            borderRadius:
                                                "30px",

                                            background:
                                                booking.bookingStatus ===
                                                "CONFIRMED"
                                                    ? "#d4edda"
                                                    : "#fff3cd",

                                            color:
                                                booking.bookingStatus ===
                                                "CONFIRMED"
                                                    ? "green"
                                                    : "#856404",

                                            fontWeight: "600"
                                        }}
                                    >
                                        {booking.bookingStatus}
                                    </span>

                                </div>

                            </div>

                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default MyBookings;

