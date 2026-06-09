import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {

    const API1 = import.meta.env.VITE_AUTH_URL;

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER"
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

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

        if (!emailRegex.test(formData.email)) {

            alert(
                "Email must contain only lowercase letters"
            );

            return;
        }

        // Password validation
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

        if (!passwordRegex.test(formData.password)) {

            alert(
                "Password must contain minimum 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
            );

            return;
        }

    try {

        setLoading(true);

        const response = await fetch(
            `${API1}/api/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            }
        );

        if (!response.ok) {

            throw new Error("Registration Failed");
        }

        const result = await response.json();

        console.log(
            "REGISTER RESPONSE =",
            result
        );

        const userData =
            result.data || result;

        const token =
            userData.accessToken || "";

        const role =
            userData.role || formData.role;

        const email =
            userData.email || formData.email;

        const name =
            userData.name || formData.name;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", email);
        localStorage.setItem("name", name);

        console.log("TOKEN =", token);
        console.log("ROLE =", role);
        console.log("EMAIL =", email);
        console.log("NAME =", name);

        if (role === "ORGANIZER") {

            navigate(
                "/create-organizer-profile"
            );

        } else {

            navigate("/organizers");
        }

    } catch (error) {

        console.log(error);

        alert("Registration Failed");

    } finally {

        setLoading(false);
    }
};

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#f8f5f0,#efe5d8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px 20px",
                boxSizing: "border-box",
                fontFamily:
                    "'Cormorant Garamond', serif"
            }}
        >

            <div
                className="register-card"
                style={{
                    width: "100%",
                    maxWidth: "540px",
                    background: "#fff",
                    borderRadius: "30px",
                    padding: "50px",
                    boxShadow:
                        "0 20px 60px rgba(0,0,0,0.12)"
                }}
            >

                {/* HEADER */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "40px"
                    }}
                >

                    <p
                        style={{
                            color: "#a47a52",
                            letterSpacing: "4px",
                            fontSize: "13px",
                            marginBottom: "10px",
                            textTransform: "uppercase"
                        }}
                    >
                        Feast & Fete
                    </p>

                    <h1
                        style={{
                            color: "#2b1408",
                            fontSize: "60px",
                            marginBottom: "10px"
                        }}
                    >
                        Register
                    </h1>

                    <p
                        style={{
                            color: "#7a6556"
                        }}
                    >
                        Create your account
                    </p>

                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit}>

                    {/* NAME */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    {/* EMAIL */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                email: e.target.value.toLowerCase()
                            })
                        }
                        required
                        style={inputStyle}
                    />

                    {/* PASSWORD */}
                    <div
                        style={{
                            position: "relative",
                            marginBottom: "22px"
                        }}
                    >
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            style={{
                                ...inputStyle,
                                marginBottom: "0"
                            }}
                        />

                        <span
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            style={{
                                position: "absolute",
                                right: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: "20px"
                            }}
                        >
                            {
                                showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                            }
                        </span>
                    </div>

                    {/* ROLE */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        style={inputStyle}
                    >

                        <option value="CUSTOMER">
                            Customer
                        </option>

                        <option value="ORGANIZER">
                            Organizer
                        </option>


                    </select>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...buttonStyle,
                            opacity: loading ? 0.7 : 1
                        }}
                    >

                        {
                            loading
                                ? "Creating..."
                                : "Create Account"
                        }

                    </button>

                </form>

                {/* LOGIN */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "25px"
                    }}
                >

                    <p>

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            style={{
                                color: "#2b1408",
                                fontWeight: "bold",
                                textDecoration: "none"
                            }}
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
};

const inputStyle = {

    width: "100%",
    padding: "18px",
    marginBottom: "22px",
    borderRadius: "14px",
    border: "1px solid #d8c8b6",
    fontSize: "16px",
    outline: "none",
    background: "#fffdf9",
    boxSizing: "border-box"
};

const buttonStyle = {

    width: "100%",
    padding: "18px",
    background: "#2b1408",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600"
};

export default Register;