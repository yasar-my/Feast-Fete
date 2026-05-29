import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const handleLogout = () => {

        localStorage.clear();

        navigate("/");
    };

    return (

        <nav
            style={{
                width: "100%",
                padding: "18px 5%",
                background: "rgba(26, 10, 0, 0.96)",
                borderBottom: "1px solid rgba(212,175,55,0.15)",
                position: "sticky",
                top: "0",
                zIndex: "9999",
                backdropFilter: "blur(10px)",
                boxSizing: "border-box"
            }}
        >

            {/* TOP BAR */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                {/* LOGO */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px"
                    }}
                >

                    <div
                        style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "50%",
                            background: "rgba(212,175,55,0.08)",
                            border: "1px solid rgba(212,175,55,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}
                    >

                        <img
                            src="/logo.png"
                            alt="logo"
                            style={{
                                width: "38px",
                                height: "38px",
                                objectFit: "contain"
                            }}
                        />

                    </div>

                    <h1
                        style={{
                            color: "#fff8ef",
                            fontSize: "34px",
                            fontWeight: "700",
                            fontFamily:
                                "'Cormorant Garamond', serif"
                        }}
                    >
                        Feast & Fete
                    </h1>

                </div>

                {/* DESKTOP MENU */}
                <div
                    className="desktop-menu"
                    style={{
                        display: "flex",
                        gap: "30px",
                        alignItems: "center"
                    }}
                >

                    <Link to="/" style={linkStyle}>
                        Home
                    </Link>

                    <Link
                        to="/organizers"
                        style={linkStyle}
                    >
                        Organizers
                    </Link>

                    {/* NOT LOGIN */}
                    {
                        !role && (
                            <>
                                <Link
                                    to="/login"
                                    style={linkStyle}
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    style={linkStyle}
                                >
                                    Register
                                </Link>
                            </>
                        )
                    }

                    {/* AFTER LOGIN */}
                    {
                        role && (
                            <>
                                <Link
                                    to="/dashboard"
                                    style={linkStyle}
                                >
                                    Dashboard
                                </Link>

                                {/* CUSTOMER */}
                                {
                                    role === "CUSTOMER" && (

                                        <Link
                                            to="/my-bookings"
                                            style={linkStyle}
                                        >
                                            My Bookings
                                        </Link>
                                    )
                                }

                                {/* ORGANIZER */}
                                {
                                    role === "ORGANIZER" && (

                                        <Link
                                            to="/organizer-bookings"
                                            style={linkStyle}
                                        >
                                            Booking Requests
                                        </Link>
                                    )
                                }

                                {/* ROLE BADGE */}
                                <span
                                    style={{
                                        color: "#d4af37",
                                        border:
                                            "1px solid rgba(212,175,55,0.3)",
                                        padding: "8px 16px",
                                        borderRadius: "30px",
                                        fontSize: "12px",
                                        letterSpacing: "2px",
                                        textTransform: "uppercase"
                                    }}
                                >
                                    {role}
                                </span>

                                {/* LOGOUT */}
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: "transparent",
                                        border:
                                            "1px solid rgba(212,175,55,0.3)",
                                        color: "#d4af37",
                                        padding: "8px 18px",
                                        borderRadius: "30px",
                                        cursor: "pointer",
                                        letterSpacing: "2px",
                                        fontSize: "12px",
                                        textTransform: "uppercase"
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        )
                    }

                </div>

                {/* MOBILE BUTTON */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="mobile-btn"
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "#d4af37",
                        cursor: "pointer",
                        display: "none"
                    }}
                >

                    {
                        menuOpen
                            ? <X size={30} />
                            : <Menu size={30} />
                    }

                </button>

            </div>

            {/* MOBILE MENU */}
            {
                menuOpen && (

                    <div
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "18px",
                            background: "rgba(61,26,0,0.95)",
                            padding: "25px",
                            borderRadius: "12px"
                        }}
                    >

                        <Link
                            to="/"
                            style={mobileLink}
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>

                        <Link
                            to="/organizers"
                            style={mobileLink}
                            onClick={() => setMenuOpen(false)}
                        >
                            Organizers
                        </Link>

                        {
                            !role && (
                                <>
                                    <Link
                                        to="/login"
                                        style={mobileLink}
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        style={mobileLink}
                                    >
                                        Register
                                    </Link>
                                </>
                            )
                        }

                        {
                            role && (
                                <>
                                    <Link
                                        to="/dashboard"
                                        style={mobileLink}
                                    >
                                        Dashboard
                                    </Link>

                                    {
                                        role === "CUSTOMER" && (

                                            <Link
                                                to="/my-bookings"
                                                style={mobileLink}
                                            >
                                                My Bookings
                                            </Link>
                                        )
                                    }

                                    {
                                        role === "ORGANIZER" && (

                                            <Link
                                                to="/organizer-bookings"
                                                style={mobileLink}
                                            >
                                                Booking Requests
                                            </Link>
                                        )
                                    }

                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            background: "transparent",
                                            border:
                                                "1px solid rgba(212,175,55,0.3)",
                                            color: "#d4af37",
                                            padding: "12px",
                                            borderRadius: "12px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Logout
                                    </button>
                                </>
                            )
                        }

                    </div>
                )
            }

            <style>
                {`
                    @media (max-width: 768px) {

                        .desktop-menu {
                            display: none !important;
                        }

                        .mobile-btn {
                            display: block !important;
                        }
                    }
                `}
            </style>

        </nav>
    );
};

const linkStyle = {

    color: "#f5e6c8",
    textDecoration: "none",
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase"
};

const mobileLink = {

    color: "#f5e6c8",
    textDecoration: "none",
    fontSize: "14px",
    letterSpacing: "2px",
    textTransform: "uppercase"
};

export default Navbar;