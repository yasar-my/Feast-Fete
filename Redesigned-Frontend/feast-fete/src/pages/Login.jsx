import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        setLoading(true);

        const response = await loginUser(formData);

        console.log("LOGIN RESPONSE =", response.data);

        const userData =
            response.data.data || response.data;

        const token =
            userData.accessToken || "";

        const role =
            userData.role || "";

        const email =
            userData.email || formData.email;

        const name =
            userData.name || "";

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", email);
        localStorage.setItem("name", name);

        console.log("TOKEN =", token);
        console.log("ROLE =", role);
        console.log("EMAIL =", email);
        console.log("NAME =", name);

        if (role === "ORGANIZER") {

            navigate("/dashboard");

        }
        else if(role === "ADMIN"){
            navigate("/admin/dashboard")
        }
        else {

            navigate("/organizers");
        }

    } catch (error) {

        console.log(error);

        alert("Invalid Credentials");

    } finally {

        setLoading(false);
    }
};

    return (

        <div
            className="min-h-screen flex"
            style={{
                fontFamily:
                    "'Cormorant Garamond', Georgia, serif"
            }}
        >

            {/* LEFT SIDE */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(160deg, #1a0a00 0%, #3d1a00 50%, #6b3010 100%)"
                }}
            >

                {/* DECORATION */}
                <div
                    style={{
                        position: "absolute",
                        top: "-80px",
                        left: "-80px",
                        width: "360px",
                        height: "360px",
                        borderRadius: "50%",
                        border:
                            "1px solid rgba(212,175,55,0.15)"
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        bottom: "-80px",
                        right: "-80px",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        border:
                            "1px solid rgba(212,175,55,0.12)"
                    }}
                />

                {/* CONTENT */}
                <div
                    className="relative z-10 text-center px-12"
                >

                    <div
                        style={{
                            fontSize: "13px",
                            letterSpacing: "6px",
                            color: "#d4af37",
                            textTransform: "uppercase",
                            marginBottom: "28px",
                            fontFamily:
                                "'Montserrat', sans-serif"
                        }}
                    >
                        Est. 2020
                    </div>

                    <h2
                        style={{
                            fontSize: "55px",
                            color: "#fff8ef",
                            lineHeight: "1.2",
                            fontWeight: "700"
                        }}
                    >
                        Crafting
                        <br />

                        <span
                            style={{
                                color: "#d4af37"
                            }}
                        >
                            Unforgettable
                        </span>

                        <br />

                        Experiences
                    </h2>

                    <p
                        style={{
                            color:
                                "rgba(255,248,239,0.6)",
                            fontSize: "17px",
                            lineHeight: "1.8",
                            marginTop: "25px",
                            fontStyle: "italic"
                        }}
                    >
                        From weddings to corporate
                        events — we bring elegance
                        to every celebration.
                    </p>

                </div>

            </div>

            {/* RIGHT SIDE */}
            <div
                className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16"
                style={{
                    background: "#fdfaf5"
                }}
            >

                <div
                    style={{
                        width: "100%",
                        maxWidth: "420px"
                    }}
                >

                    {/* HEADER */}
                    <div
                        className="text-center mb-12"
                    >

                        <h1
                            style={{
                                fontSize: "45px",
                                color: "#1a0a00",
                                fontWeight: "700",
                                marginBottom: "10px"
                            }}
                        >
                            Feast & Fete
                        </h1>

                        <p
                            style={{
                                fontSize: "12px",
                                letterSpacing: "4px",
                                color: "#8b7040",
                                textTransform:
                                    "uppercase",
                                fontFamily:
                                    "'Montserrat', sans-serif"
                            }}
                        >
                            Premium Catering Platform
                        </p>

                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}
                        <div
                            style={{
                                marginBottom: "28px"
                            }}
                        >

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "10px",
                                    fontSize: "12px",
                                    color: "#8b7040",
                                    letterSpacing: "2px",
                                    textTransform:
                                        "uppercase",
                                    fontFamily:
                                        "'Montserrat', sans-serif"
                                }}
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "15px",
                                    border: "none",
                                    borderBottom:
                                        "2px solid #c8b070",
                                    background:
                                        "transparent",
                                    outline: "none",
                                    fontSize: "17px",
                                    boxSizing:
                                        "border-box"
                                }}
                            />

                        </div>

                        {/* PASSWORD */}
                        <div
                            style={{
                                marginBottom: "40px"
                            }}
                        >

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "10px",
                                    fontSize: "12px",
                                    color: "#8b7040",
                                    letterSpacing: "2px",
                                    textTransform:
                                        "uppercase",
                                    fontFamily:
                                        "'Montserrat', sans-serif"
                                }}
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                value={
                                    formData.password
                                }
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "15px",
                                    border: "none",
                                    borderBottom:
                                        "2px solid #c8b070",
                                    background:
                                        "transparent",
                                    outline: "none",
                                    fontSize: "17px",
                                    boxSizing:
                                        "border-box"
                                }}
                            />

                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "16px",
                                background: "#1a0a00",
                                color: "#d4af37",
                                border: "none",
                                fontSize: "13px",
                                letterSpacing: "4px",
                                textTransform:
                                    "uppercase",
                                cursor: "pointer",
                                transition:
                                    "0.3s ease",
                                fontFamily:
                                    "'Montserrat', sans-serif"
                            }}
                        >

                            {
                                loading
                                    ? "Signing In..."
                                    : "Sign In"
                            }

                        </button>

                    </form>

                    {/* FOOTER */}
                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "35px",
                            fontSize: "12px",
                            color: "#b0956a",
                            fontStyle: "italic"
                        }}
                    >
                        Crafted with passion for
                        culinary excellence
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;