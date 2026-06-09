import { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {

    const API3 = import.meta.env.VITE_BOOKING_URL;

    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {

        axios
            .get(`${API3}/api/booking/all`)
            .then((res) => {
                setBookings(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    }, []);

    const filteredBookings = bookings.filter((booking) => {

        const matchesSearch =
            booking.customerName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            booking.customerEmail
                ?.toLowerCase()
                .includes(search.toLowerCase());

        const matchesFilter =
            filter === "ALL"
                ? true
                : booking.bookingStatus === filter;

        return matchesSearch && matchesFilter;

    });

    return (
        <div
            style={{
                padding: "40px",
                background: "#f8f8f8",
                minHeight: "100vh"
            }}
        >

            <h1
                style={{
                    marginBottom: "25px",
                    color: "#2c0d00"
                }}
            >
                Booking Management
            </h1>

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "25px"
                }}
            >

                <input
                    type="text"
                    placeholder="Search name or email..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid #ddd"
                    }}
                />

                <select
                    value={filter}
                    onChange={(e) =>
                        setFilter(e.target.value)
                    }
                    style={{
                        padding: "12px",
                        borderRadius: "10px"
                    }}
                >
                    <option value="ALL">All</option>
                    <option value="PENDING">
                        Pending
                    </option>
                    <option value="CONFIRMED">
                        Confirmed
                    </option>
                    <option value="COMPLETED">
                        Completed
                    </option>
                </select>

            </div>

            <div
                style={{
                    overflowX: "auto",
                    background: "#fff",
                    borderRadius: "15px"
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <thead>

                        <tr
                            style={{
                                background: "#2c0d00",
                                color: "#d4af37"
                            }}
                        >
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Event Date</th>
                            <th>Meal</th>
                            <th>Guests</th>
                            <th>Total</th>
                            <th>Advance</th>
                            <th>Paid</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredBookings.map((booking) => (

                            <tr
                                key={booking.id}
                                style={{
                                    borderBottom:
                                        "1px solid #eee"
                                }}
                            >
                                <td>{booking.id}</td>

                                <td>
                                    {booking.customerName}
                                </td>

                                <td>
                                    {booking.customerEmail}
                                </td>

                                <td>
                                    {booking.customerMobile}
                                </td>

                                <td>
                                    {booking.eventDate}
                                </td>

                                <td>
                                    {booking.mealType}
                                </td>

                                <td>
                                    {booking.guestCount}
                                </td>

                                <td>
                                    ₹{booking.totalAmount}
                                </td>

                                <td>
                                    ₹{booking.advanceAmount}
                                </td>

                                <td>
                                    {booking.advancePaid
                                        ? "✅"
                                        : "❌"}
                                </td>

                                <td>
                                    {
                                        booking.bookingStatus
                                    }
                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default AdminBookings;