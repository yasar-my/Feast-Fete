import { useEffect, useState } from "react";
import axios from "axios";
import {
    Mail,
    Calendar,
    UtensilsCrossed,
    Users,
    Wallet,
    CreditCard,
    CheckCircle
} from "lucide-react";

const MyBookings = () => {

    const API3 = import.meta.env.VITE_BOOKING_URL;
    const API4 = import.meta.env.VITE_PAYMENT_URL;

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const customerEmail = localStorage.getItem("email");

    const handleCompleteBooking = async (
    bookingId
) => {

    try {

        await fetch(
            `${API3}/api/booking/complete/${bookingId}`,
            {
                method: "PUT"
            }
        );

        setBookings((prev) =>
            prev.map((booking) =>
                booking.id === bookingId
                    ? {
                          ...booking,
                          bookingStatus:
                              "COMPLETED"
                      }
                    : booking
            )
        );

    } catch (error) {

        console.log(error);

        alert(
            "Failed to Complete Booking"
        );
    }
};

    const handleAdvancePayment = async (booking) => {

    try {

        const response = await axios.post(
            `${API4}/api/payment/create-order`,
            {
                bookingId: booking.id,
                customerEmail: booking.customerEmail,
                amount: booking.advanceAmount,
                paymentType: "ADVANCE"
            }
        );

        const data = response.data;

        const options = {
            key: data.key,
            amount: data.amount * 100,
            currency: data.currency,
            name: "Feast & Fete",
            description: "Advance Payment",
            order_id: data.orderId,

            handler: async function () {

                await fetch(
                    `${API3}/api/booking/advance-paid/${booking.id}`,
                    {
                        method: "PUT"
                    }
                );

                alert("Payment Successful");

                window.location.reload();
            }
        };

        const razorpay = new window.Razorpay(options);

        razorpay.open();

    } catch (error) {

        console.log(error);

        alert("Payment Failed");
    }
};

    const downloadInvoice = (bookingId) => {

        window.open(
            `${API3}/api/booking/invoice/${bookingId}`,
            "_blank"
        );
    };
const handleCancelBooking = async (bookingId) => {

    try {

        await fetch(
            `${API3}/api/booking/cancel/${bookingId}`,
            {
                method: "PUT"
            }
        );

        setBookings(prev =>
            prev.map(booking =>
                booking.id === bookingId
                    ? {
                        ...booking,
                        bookingStatus: "CANCELLED"
                    }
                    : booking
            )
        );

    } catch (error) {

        console.log(error);
    }
};

    useEffect(() => {

        fetch(
            `${API3}/api/booking/customer/${customerEmail}`
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
                    bookings.map((booking) =>{
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        const eventDate = new Date(
                            booking.eventDate
                        );
                        eventDate.setHours(0, 0, 0, 0);

                        const eventCompleted =
                            eventDate <= today;
                      return (

                        <div
                            key={booking.id}
                            style={{
                                background: "#fff",
                                borderRadius: "30px",
                                padding: "40px",
                                boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "30px"
                            }}
                        >

                            <div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "15px",
                                        marginBottom: "25px"
                                    }}
                                >
                                    <Mail color="#8B5E00" />
                                    <h3>{booking.organizerEmail}</h3>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gap: "18px"
                                    }}
                                >

                                    <p>
                                        <Calendar
                                            size={20}
                                            color="#8B5E00"
                                        />
                                        {" "} Event Date : {booking.eventDate}
                                    </p>

                                    <p>
                                        <UtensilsCrossed
                                            size={20}
                                            color="#8B5E00"
                                        />
                                        {" "} Meal Type : {booking.mealType}
                                    </p>

                                    <p>
                                        <Users
                                            size={20}
                                            color="#8B5E00"
                                        />
                                        {" "} Guests : {booking.guestCount}
                                    </p>

                                    <p>
                                        <Wallet
                                            size={20}
                                            color="#8B5E00"
                                        />
                                        {" "} Total : ₹ {booking.totalAmount}
                                    </p>

                                    <p>
                                        <CreditCard
                                            size={20}
                                            color="#8B5E00"
                                        />
                                        {" "} Advance : ₹ {booking.advanceAmount}
                                    </p>

                                </div>

                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "15px",
                                    alignItems: "center"
                                }}
                            >

                                <span
                                    style={{
                                        padding: "14px 25px",
                                        borderRadius: "18px",
                                        fontWeight: "700",
                                        fontSize: "18px",
                                        background:
                                            booking.bookingStatus === "CONFIRMED"
                                                ? "#d4edda"
                                                : booking.bookingStatus === "COMPLETED"
                                                ? "#d1ecf1"
                                                : "#fff3cd",

                                        color:
                                            booking.bookingStatus === "CONFIRMED"
                                                ? "#16a34a"
                                                : booking.bookingStatus === "COMPLETED"
                                                ? "#0c5460"
                                                : "#856404"
                                    }}
                                >
                                    {booking.bookingStatus}
                                </span>

                                {booking.bookingStatus === "CONFIRMED" &&
                                    !booking.advancePaid && (

                                    <button
                                        onClick={() =>
                                            handleAdvancePayment(booking)
                                        }
                                        style={{
                                            background:
                                                "linear-gradient(90deg,#16a34a,#22c55e)",
                                            color: "#fff",
                                            border: "none",
                                            padding: "15px 28px",
                                            borderRadius: "16px",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            fontSize: "18px"
                                        }}
                                    >
                                        Pay Advance ₹ {booking.advanceAmount}
                                    </button>
                                )}

                                {booking.bookingStatus === "CONFIRMED" &&
                                    booking.advancePaid && (

                                    <>
                                        <span
                                            style={{
                                                color: "#16a34a",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            <CheckCircle size={18} />
                                            {" "}Advance Paid
                                        </span>

                                        <button
                                            onClick={() =>
                                                downloadInvoice(booking.id)
                                            }
                                            style={{
                                                background: "#7c3aed",
                                                color: "#fff",
                                                border: "none",
                                                padding: "12px 25px",
                                                borderRadius: "12px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Download Invoice
                                        </button>
                                    </>
                                )}

                            </div>

                        </div>
                        );}
                )
                
                }

            </div>

        </div>
    );
};

export default MyBookings;

