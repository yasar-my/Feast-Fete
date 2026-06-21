import { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {

    const API1 = import.meta.env.VITE_AUTH_URL;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [removingIds, setRemovingIds] = useState(new Set());

    const thStyle = {
        padding: "18px",
        textAlign: "left"
    };

    const tdStyle = {
        padding: "18px"
    };

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        axios.get(
            `${API1}/api/admin/users`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )
        .then((res) => {

            setUsers(res.data);

        })
        .catch((err) => {

            console.log(err);

        })
        .finally(() => {
            setLoading(false);
        });

    }, []);

    const deleteUser = (id) => {

        setRemovingIds((prev) => new Set(prev).add(id));

        setTimeout(async () => {

            const token =
                localStorage.getItem("token");

            try {
                await axios.delete(
                    `${API1}/api/admin/user/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setUsers(
                    users.filter(
                        user => user.id !== id
                    )
                );
            } catch (err) {
                console.log(err);
            } finally {
                setRemovingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }

        }, 360);
    };

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
            @keyframes rowIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            @keyframes shimmer {
                0% { background-position: -300px 0; }
                100% { background-position: 300px 0; }
            }
            @keyframes crownPulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); }
                50% { box-shadow: 0 0 0 5px rgba(212,175,55,0); }
            }

            .user-row {
                transition: background 0.25s ease, opacity 0.35s ease, transform 0.35s ease;
            }
            .user-row:hover {
                background: #fbf6ea;
            }
            .user-row.removing {
                opacity: 0;
                transform: translateX(40px) scale(0.97);
            }

            .role-badge.admin {
                animation: crownPulse 2.4s ease-in-out infinite;
            }

            .delete-btn {
                transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
            }
            .delete-btn:hover {
                background: #c4202f !important;
                transform: translateY(-2px);
                box-shadow: 0 8px 18px rgba(220,53,69,0.35);
            }
            .delete-btn:active {
                transform: translateY(0) scale(0.96);
            }

            .skeleton-row td {
                padding: 18px;
            }
            .skeleton-block {
                height: 14px;
                border-radius: 6px;
                background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
                background-size: 300px 100%;
                animation: shimmer 1.4s ease-in-out infinite;
            }

            .spinner {
                width: 32px;
                height: 32px;
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
                fontSize: "32px",
                marginBottom: "30px",
                color: "#2c0d00",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(-16px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
        >
            Manage Users
        </h1>

        <div
            style={{
                background: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow:
                    "0 10px 30px rgba(0,0,0,0.08)",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
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
                            background:
                                "#2c0d00",
                            color: "#d4af37"
                        }}
                    >
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Role</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {loading && (
                        [...Array(4)].map((_, i) => (
                            <tr key={`s-${i}`} className="skeleton-row" style={{ borderBottom: "1px solid #eee" }}>
                                <td><div className="skeleton-block" style={{ width: "30px" }} /></td>
                                <td><div className="skeleton-block" style={{ width: "120px" }} /></td>
                                <td><div className="skeleton-block" style={{ width: "180px" }} /></td>
                                <td><div className="skeleton-block" style={{ width: "70px" }} /></td>
                                <td><div className="skeleton-block" style={{ width: "70px" }} /></td>
                            </tr>
                        ))
                    )}

                    {!loading && users.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
                                <div style={{ fontSize: "36px", marginBottom: "10px" }}>👤</div>
                                No users found.
                            </td>
                        </tr>
                    )}

                    {!loading && users.map((user, index) => (
                        <tr
                            key={user.id}
                            className={`user-row${removingIds.has(user.id) ? " removing" : ""}`}
                            style={{
                                borderBottom:
                                    "1px solid #eee",
                                animation: `rowIn 0.4s cubic-bezier(0.22,1,0.36,1) ${Math.min(index * 0.05, 0.5)}s both`,
                            }}
                        >
                            <td style={tdStyle}>
                                {user.id}
                            </td>

                            <td style={tdStyle}>
                                {user.name}
                            </td>

                            <td style={tdStyle}>
                                {user.email}
                            </td>

                            <td style={tdStyle}>
                                <span
                                    className={user.role === "ADMIN" ? "role-badge admin" : "role-badge"}
                                    style={{
                                        padding:
                                            "6px 12px",
                                        borderRadius:
                                            "20px",
                                        background:
                                            user.role ===
                                            "ADMIN"
                                                ? "#ffefc2"
                                                : "#f2f2f2",
                                        display: "inline-block",
                                    }}
                                >
                                    {user.role === "ADMIN" ? "👑 " : ""}{user.role}
                                </span>
                            </td>

                            <td style={tdStyle}>

                                {
                                    user.role !==
                                    "ADMIN" && (
                                        <button
                                            onClick={() =>
                                                deleteUser(
                                                    user.id
                                                )
                                            }
                                            className="delete-btn"
                                            style={{
                                                background:
                                                    "#dc3545",
                                                color:
                                                    "#fff",
                                                border:
                                                    "none",
                                                padding:
                                                    "8px 16px",
                                                borderRadius:
                                                    "8px",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )
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

export default AdminUsers;
