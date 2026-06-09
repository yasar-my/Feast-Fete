import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const API1 = import.meta.env.VITE_AUTH_URL;

    const [stats, setStats] = useState({});

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        axios.get(
            `${API1}/api/admin/stats`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((res) => {
            setStats(res.data);
        })
        .catch((err) => {
            console.log(err);
        });

    }, []);

        return (
        <div
            style={{
                padding: "40px",
                background: "#f8f8f8",
                minHeight: "100vh"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "40px"
                }}
            >

                <div>

                    <h1
                        style={{
                            color: "#2c0d00",
                            marginBottom: "10px"
                        }}
                    >
                        Admin Dashboard
                    </h1>

                    <p
                        style={{
                            color: "#666"
                        }}
                    >
                        Manage users, organizers and platform activities
                    </p>

                </div>

                <button
                    onClick={() =>
                        navigate("/admin/users")
                    }
                    style={{
                        background: "#2c0d00",
                        color: "#d4af37",
                        border: "none",
                        padding: "14px 25px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: "600"
                    }}
                >
                    Manage Users
                </button>

                <button
                    onClick={() => navigate("/admin/bookings")}
                    style={{
                        background: "#16A34A",
                        color: "#fff",
                        border: "none",
                        padding: "14px 25px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: "600",
                        marginLeft: "10px"
                    }}
                >
                    Manage Bookings
                </button>

            </div>

            {/* STATS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(280px,1fr))",
                    gap: "25px"
                }}
            >

                <Card
                    title="Total Users"
                    value={stats.totalUsers}
                    color="#4F46E5"
                />

                <Card
                    title="Customers"
                    value={stats.customers}
                    color="#16A34A"
                />

                <Card
                    title="Organizers"
                    value={stats.organizers}
                    color="#EA580C"
                />

            </div>

        </div>
    );
};
const Card = ({
    title,
    value,
    color
}) => (

    <div
        style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "30px",
            boxShadow:
                "0 15px 30px rgba(0,0,0,0.08)",
            borderLeft:
                `6px solid ${color}`
        }}
    >

        <h3
            style={{
                color: "#666",
                marginBottom: "15px",
                fontSize: "18px"
            }}
        >
            {title}
        </h3>

        <h1
            style={{
                color: color,
                fontSize: "42px",
                margin: 0
            }}
        >
            {value || 0}
        </h1>

    </div>
);

export default AdminDashboard;