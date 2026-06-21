import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../Images/logo.jpeg";

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleLogout = () => {

        localStorage.clear();

        navigate("/");
    };

    return (

        <nav
            style={{
                width: "100%",
                padding: scrolled ? "10px 5%" : "18px 5%",
                background: "rgba(26, 10, 0, 0.96)",
                borderBottom: "1px solid rgba(212,175,55,0.15)",
                position: "sticky",
                top: "0",
                zIndex: "9999",
                backdropFilter: "blur(10px)",
                boxSizing: "border-box",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(-16px)",
                transition:
                    "padding 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, opacity 0.6s ease, transform 0.6s ease",
                boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.35)" : "none",
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
                    className="logo-wrap"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px"
                    }}
                >

                    <div
                        className="logo-ring"
                        style={{
                            width: scrolled ? "60px" : "75px",
                            height: scrolled ? "60px" : "75px",
                            borderRadius: "50%",
                            background: "#1a0a00",
                            border: "2px solid #d4af37",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            transition: "width 0.35s ease, height 0.35s ease, transform 0.3s ease",
                        }}
                    >
                        <img
                            src={logo}
                            alt="logo"
                            style={{
                                width: "92%",
                                height: "92%",
                                objectFit: "cover",
                                borderRadius: "50%"
                            }}
                        />
                    </div>

                    <h1
                        style={{
                            color: "#fff8ef",
                            fontSize: scrolled ? "26px" : "34px",
                            fontWeight: "700",
                            fontFamily: "'Cormorant Garamond', serif",
                            transition: "font-size 0.35s ease",
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

                    <Link to="/" className="nav-link" style={linkStyle}>
                        Home
                    </Link>

                    <Link
                        to="/organizers"
                        className="nav-link"
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
                                    className="nav-link"
                                    style={linkStyle}
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="nav-link"
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
                                    to={
                                        role === "ADMIN"
                                            ? "/admin/dashboard"
                                            : "/dashboard"
                                    }
                                    className="nav-link"
                                    style={linkStyle}
                                >
                                    Dashboard
                                </Link>

                                {/* CUSTOMER */}
                                {
                                    role === "CUSTOMER" && (

                                        <Link
                                            to="/my-bookings"
                                            className="nav-link"
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
                                            to="/booking-requests"
                                            className="nav-link"
                                            style={linkStyle}
                                        >
                                            Booking Requests
                                        </Link>
                                    )
                                }

                                {/* ROLE BADGE */}
                                <span
                                    className="role-badge"
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
                                    className="logout-btn"
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

                    <span key={menuOpen ? "open" : "closed"} className="icon-pop" style={{ display: "inline-flex" }}>
                        {
                            menuOpen
                                ? <X size={30} />
                                : <Menu size={30} />
                        }
                    </span>

                </button>

            </div>

            {/* MOBILE MENU (always mounted so it can animate open AND closed) */}
            <div
                className="mobile-menu"
                style={{
                    maxHeight: menuOpen ? "600px" : "0px",
                    opacity: menuOpen ? 1 : 0,
                    marginTop: menuOpen ? "20px" : "0px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                    background: "rgba(61,26,0,0.95)",
                    padding: menuOpen ? "25px" : "0 25px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition:
                        "max-height 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease, margin-top 0.4s ease, padding 0.4s ease",
                }}
            >

                <Link
                    to="/"
                    style={{
                        ...mobileLink,
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? "translateX(0)" : "translateX(-18px)",
                        transition: "opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s",
                    }}
                    onClick={() => setMenuOpen(false)}
                >
                    Home
                </Link>

                <Link
                    to="/organizers"
                    style={{
                        ...mobileLink,
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? "translateX(0)" : "translateX(-18px)",
                        transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
                    }}
                    onClick={() => setMenuOpen(false)}
                >
                    Organizers
                </Link>

                {
                    !role && (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    ...mobileLink,
                                    opacity: menuOpen ? 1 : 0,
                                    transform: menuOpen ? "translateX(0)" : "translateX(-18px)",
                                    transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
                                }}
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                style={{
                                    ...mobileLink,
                                    opacity: menuOpen ? 1 : 0,
                                    transform: menuOpen ? "translateX(0)" : "translateX(-18px)",
                                    transition: "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
                                }}
                                onClick={() => setMenuOpen(false)}
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
                                to={
                                    role === "ADMIN"
                                        ? "/admin/dashboard"
                                        : "/dashboard"
                                }
                                style={{
                                    ...mobileLink,
                                    opacity: menuOpen ? 1 : 0,
                                    transform: menuOpen ? "translateX(0)" : "translateX(-18px)",
                                    transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
                                }}
                                onClick={() => setMenuOpen(false)}
                            >
                                Dashboard
                            </Link>

                            {
                                role === "CUSTOMER" && (

                                    <Link
                                        to="/my-bookings"
                                        style={{
                                            ...mobileLink,
                                            opacity: menuOpen ? 1 : 0,
                                            transform: menuOpen ? "translateX(0)" : "translateX(-18px)",
                                            transition: "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
                                        }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        My Bookings
                                    </Link>
                                )
                            }

                            {
                                role === "ORGANIZER" && (

                                    <Link
                                        to="/booking-requests"
                                        style={{
                                            ...mobileLink,
                                            opacity: menuOpen ? 1 : 0,
                                            transform: menuOpen ? "translateX(0)" : "translateX(-18px)",
                                            transition: "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
                                        }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Booking Requests
                                    </Link>
                                )
                            }

                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                                style={{
                                    background: "transparent",
                                    border:
                                        "1px solid rgba(212,175,55,0.3)",
                                    color: "#d4af37",
                                    padding: "12px",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    opacity: menuOpen ? 1 : 0,
                                    transform: menuOpen ? "translateX(0)" : "translateX(-18px)",
                                    transition: "opacity 0.4s ease 0.25s, transform 0.4s ease 0.25s",
                                }}
                            >
                                Logout
                            </button>
                        </>
                    )
                }

            </div>

            <style>
                {`
                    @keyframes ringPulse {
                        0%, 100% { box-shadow: 0 0 12px rgba(212,175,55,0.4); }
                        50% { box-shadow: 0 0 22px rgba(212,175,55,0.75); }
                    }
                    @keyframes badgePulse {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.35); }
                        50% { box-shadow: 0 0 0 6px rgba(212,175,55,0); }
                    }
                    @keyframes popIn {
                        from { opacity: 0; transform: scale(0.6) rotate(-60deg); }
                        to { opacity: 1; transform: scale(1) rotate(0deg); }
                    }

                    .logo-ring { animation: ringPulse 3.2s ease-in-out infinite; }
                    .logo-wrap:hover .logo-ring { transform: scale(1.06); }

                    .nav-link {
                        position: relative;
                        transition: color 0.3s ease;
                    }
                    .nav-link::after {
                        content: "";
                        position: absolute;
                        left: 0;
                        bottom: -6px;
                        width: 0%;
                        height: 1px;
                        background: #d4af37;
                        transition: width 0.3s ease;
                    }
                    .nav-link:hover {
                        color: #d4af37 !important;
                    }
                    .nav-link:hover::after {
                        width: 100%;
                    }

                    .role-badge { animation: badgePulse 2.6s ease-in-out infinite; }

                    .logout-btn { transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease; }
                    .logout-btn:hover {
                        background: #d4af37 !important;
                        color: #1a0a00 !important;
                        transform: translateY(-2px);
                    }

                    .icon-pop { animation: popIn 0.3s cubic-bezier(0.22,1,0.36,1); }

                    .mobile-btn:hover { transform: scale(1.08); }

                    @media (max-width: 768px) {

                        .desktop-menu {
                            display: none !important;
                        }

                        .mobile-btn {
                            display: block !important;
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        *, *::before, *::after {
                            animation-duration: 0.001ms !important;
                            animation-iteration-count: 1 !important;
                            transition-duration: 0.001ms !important;
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
