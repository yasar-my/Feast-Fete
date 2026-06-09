import { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {

    const API1 = import.meta.env.VITE_AUTH_URL;

    const [users, setUsers] = useState([]);

    const thStyle = {
        padding: "18px",
        textAlign: "left"
    };

    const tdStyle = {
        padding: "18px"
    };

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

        });

    }, []);

    const deleteUser = async (id) => {

        const token =
            localStorage.getItem("token");

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
    };
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
                fontSize: "32px",
                marginBottom: "30px",
                color: "#2c0d00"
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
                    "0 10px 30px rgba(0,0,0,0.08)"
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
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            style={{
                                borderBottom:
                                    "1px solid #eee"
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
                                    style={{
                                        padding:
                                            "6px 12px",
                                        borderRadius:
                                            "20px",
                                        background:
                                            user.role ===
                                            "ADMIN"
                                                ? "#ffefc2"
                                                : "#f2f2f2"
                                    }}
                                >
                                    {user.role}
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