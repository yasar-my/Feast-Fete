import { useEffect, useState } from "react";
import axios from "axios";

const Counter = ({ value, duration = 900 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = null;
        let frame;

        const step = (timestamp) => {
            if (start === null) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(value * eased));
            if (progress < 1) frame = requestAnimationFrame(step);
            else setCount(value);
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [value]);

    return <>{count}</>;
};

const STATUS_STYLES = {
    PENDING: { bg: "#fff4e0", color: "#b8860b", pulse: true },
    CONFIRMED: { bg: "#e6f4ea", color: "#1e7e34", pulse: false },
    COMPLETED: { bg: "#e8f0fe", color: "#1a56db", pulse: false },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_STYLES[status] || { bg: "#f1f1f1", color: "#555", pulse: false };
    return (
        <span
            className={s.pulse ? "status-pill pulse" : "status-pill"}
            style={{ background: s.bg, color: s.color }}
        >
            {s.pulse && <span className="status-dot" style={{ background: s.color }} />}
            {status}
        </span>
    );
};

const AdminBookings = () => {

    const API3 = import.meta.env.VITE_BOOKING_URL;

    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {

        setLoading(true);

        axios
            .get(`${API3}/api/booking/all`)
            .then((res) => {
                setBookings(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
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

    const counts = {
        total: bookings.length,
        pending: bookings.filter((b) => b.bookingStatus === "PENDING").length,
        confirmed: bookings.filter((b) => b.bookingStatus === "CONFIRMED").length,
        completed: bookings.filter((b) => b.bookingStatus === "COMPLETED").length,
    };

    const bodyKey = `${search}-${filter}`;

    return (
        <div
            style={{
                padding: "40px",
                background: "#f8f8f8",
                minHeight: "100vh"
            }}
        >
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes rowIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes dotPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.6); opacity: 0.4; }
                }

                .stat-card {
                    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
                }
                .stat-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 16px 30px rgba(0,0,0,0.1);
                }

                .search-input, .filter-select {
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                .search-input:focus, .filter-select:focus {
                    outline: none;
                    border-color: #d4af37 !important;
                    box-shadow: 0 0 0 4px rgba(212,175,55,0.18);
                }

                .booking-row {
                    transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
                }
                .booking-row:hover {
                    background: #fbf6ea !important;
                    transform: scale(1.003);
                    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
                }

                .status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 12px;
                    border-radius: 30px;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                .status-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    animation: dotPulse 1.4s ease-in-out infinite;
                }

                .spinner {
                    width: 34px;
                    height: 34px;
                    border: 3px solid #eee;
                    border-top-color: #2c0d00;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.001ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.001ms !important;
                    }
                }
            `}</style>

            <h1
                style={{
                    marginBottom: "25px",
                    color: "#2c0d00",
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(-16px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
            >
                Booking Management
            </h1>

            {/* SUMMARY STAT CARDS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                    gap: "18px",
                    marginBottom: "30px",
                }}
            >
                {[
                    { label: "Total Bookings", value: counts.total, accent: "#2c0d00" },
                    { label: "Pending", value: counts.pending, accent: "#b8860b" },
                    { label: "Confirmed", value: counts.confirmed, accent: "#1e7e34" },
                    { label: "Completed", value: counts.completed, accent: "#1a56db" },
                ].map((card, index) => (
                    <div
                        key={card.label}
                        className="stat-card"
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            padding: "20px",
                            borderLeft: `4px solid ${card.accent}`,
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "translateY(0)" : "translateY(18px)",
                            transition: `opacity 0.5s ease ${0.1 + index * 0.08}s, transform 0.5s ease ${0.1 + index * 0.08}s`,
                        }}
                    >
                        <p style={{ color: "#888", fontSize: "13px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            {card.label}
                        </p>
                        <h2 style={{ color: card.accent, fontSize: "32px", margin: 0 }}>
                            <Counter value={card.value} />
                        </h2>
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "25px",
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(14px)",
                    transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
                }}
            >

                <input
                    type="text"
                    placeholder="Search name or email..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="search-input"
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
                    className="filter-select"
                    style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid #ddd"
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
                    borderRadius: "15px",
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s",
                }}
            >

                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "70px 20px", gap: "16px" }}>
                        <div className="spinner" />
                        <p style={{ color: "#888" }}>Loading bookings...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "70px 20px",
                            color: "#999",
                            animation: "fadeInUp 0.5s ease",
                        }}
                    >
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗂️</div>
                        <p style={{ fontSize: "16px" }}>No bookings match your search.</p>
                    </div>
                ) : (
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

                        <tbody key={bodyKey}>

                            {filteredBookings.map((booking, index) => (

                                <tr
                                    key={booking.id}
                                    className="booking-row"
                                    style={{
                                        borderBottom: "1px solid #eee",
                                        animation: `rowIn 0.4s cubic-bezier(0.22,1,0.36,1) ${Math.min(index * 0.04, 0.5)}s both`,
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
                                        <StatusBadge status={booking.bookingStatus} />
                                    </td>
                                </tr>

                            ))}

                        </tbody>

                    </table>
                )}

            </div>

        </div>
    );
};

export default AdminBookings;
