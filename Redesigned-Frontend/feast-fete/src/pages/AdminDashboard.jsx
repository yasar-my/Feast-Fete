import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Counter = ({ value = 0, duration = 1100 }) => {
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

const AdminDashboard = () => {
    const API1 = import.meta.env.VITE_AUTH_URL;

    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(t);
    }, []);

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
        })
        .finally(() => {
            setLoading(false);
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
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-18px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -300px 0; }
                    100% { background-position: 300px 0; }
                }
                @keyframes growBar {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }

                .admin-btn {
                    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, filter 0.3s ease;
                }
                .admin-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.18);
                    filter: brightness(1.06);
                }
                .admin-btn:active {
                    transform: translateY(-1px) scale(0.98);
                }

                .stat-card {
                    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
                    position: relative;
                    overflow: hidden;
                }
                .stat-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 22px 40px rgba(0,0,0,0.14);
                }
                .stat-card .accent-bar {
                    transform-origin: left;
                    animation: growBar 0.7s cubic-bezier(0.22,1,0.36,1) both;
                }

                .skeleton {
                    background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
                    background-size: 400px 100%;
                    animation: shimmer 1.4s ease-in-out infinite;
                    border-radius: 8px;
                }

                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.001ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.001ms !important;
                    }
                }
            `}</style>

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "40px",
                    flexWrap: "wrap",
                    gap: "16px",
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateY(0)" : "translateY(-18px)",
                    transition: "opacity 0.55s ease, transform 0.55s ease",
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

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

                    <button
                        onClick={() =>
                            navigate("/admin/users")
                        }
                        className="admin-btn"
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
                        className="admin-btn"
                        style={{
                            background: "#16A34A",
                            color: "#fff",
                            border: "none",
                            padding: "14px 25px",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Manage Bookings
                    </button>

                </div>

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
                    icon="👥"
                    title="Total Users"
                    value={stats.totalUsers}
                    color="#4F46E5"
                    loading={loading}
                    delay={0.1}
                />

                <Card
                    icon="🧑‍🤝‍🧑"
                    title="Customers"
                    value={stats.customers}
                    color="#16A34A"
                    loading={loading}
                    delay={0.2}
                />

                <Card
                    icon="🎪"
                    title="Organizers"
                    value={stats.organizers}
                    color="#EA580C"
                    loading={loading}
                    delay={0.3}
                />

            </div>

        </div>
    );
};

const Card = ({
    icon,
    title,
    value,
    color,
    loading,
    delay = 0
}) => (

    <div
        className="stat-card"
        style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "30px",
            boxShadow:
                "0 15px 30px rgba(0,0,0,0.08)",
            borderLeft:
                `6px solid ${color}`,
            animation: `fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
        }}
    >

        <div
            className="accent-bar"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "3px",
                width: "100%",
                background: color,
                animationDelay: `${delay + 0.15}s`,
            }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
            <span style={{ fontSize: "20px" }}>{icon}</span>
            <h3
                style={{
                    color: "#666",
                    fontSize: "18px",
                    margin: 0,
                }}
            >
                {title}
            </h3>
        </div>

        {loading ? (
            <div className="skeleton" style={{ width: "90px", height: "42px" }} />
        ) : (
            <h1
                style={{
                    color: color,
                    fontSize: "42px",
                    margin: 0
                }}
            >
                <Counter value={value || 0} />
            </h1>
        )}

    </div>
);

export default AdminDashboard;
