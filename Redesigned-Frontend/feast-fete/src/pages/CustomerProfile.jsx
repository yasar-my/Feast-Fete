import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerProfile = () => {

    const API2 = import.meta.env.VITE_PROFILE_URL;
    
    const navigate = useNavigate();

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(t);
    }, []);

    const [formData, setFormData] = useState({

        name: "",
        email: localStorage.getItem("email") || "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        profilePhoto: ""
    });

    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    // INPUT CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        // MOBILE ONLY NUMBER
        if (name === "mobile") {

            const onlyNums =
                value.replace(/\D/g, "");

            setFormData({
                ...formData,
                mobile: onlyNums
            });

            return;
        }

        // PINCODE ONLY NUMBER
        if (name === "pincode") {

            const onlyNums =
                value.replace(/\D/g, "");

            setFormData({
                ...formData,
                pincode: onlyNums
            });

            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // IMAGE
    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setPreview(
            URL.createObjectURL(file)
        );

        setFormData({
            ...formData,
            profilePhoto: file.name
        });
    };

    // SUBMIT
    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        // VALIDATION
        if (formData.mobile.length !== 10) {

            setMessage(
                "Mobile Number Must Be 10 Digits"
            );

            return;
        }

        if (formData.pincode.length !== 6) {

            setMessage(
                "Pincode Must Be 6 Digits"
            );

            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API2}/api/customer/create`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Customer Profile Creation Failed"
                );
            }

            const data = await response.json();

            console.log(data);

            localStorage.setItem(
                "customerProfileId",
                data.id
            );

            setMessage(
                "Customer Profile Created Successfully"
            );

            setTimeout(() => {

                navigate("/dashboard");

            }, 1500);

        } catch (error) {

            console.log(error);

            setMessage(
                "Backend Server Error"
            );

        } finally {

            setLoading(false);
        }
    };

    const isSuccess = message.includes("Successfully");

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f7",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px 20px"
            }}
        >
            <style>{`
                @keyframes formIn {
                    from { opacity: 0; transform: translateY(28px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes shake {
                    10%, 90% { transform: translateX(-1px); }
                    20%, 80% { transform: translateX(2px); }
                    30%, 50%, 70% { transform: translateX(-4px); }
                    40%, 60% { transform: translateX(4px); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes checkPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }

                .form-field {
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                .form-field:focus {
                    outline: none;
                    border-color: #b8860b !important;
                    box-shadow: 0 0 0 4px rgba(184,134,11,0.16);
                }

                .message-banner { animation: popIn 0.35s cubic-bezier(0.22,1,0.36,1); }
                .message-banner.is-error { animation: shake 0.5s ease; }
                .message-banner.is-success .check-icon { animation: checkPulse 1s ease-in-out infinite; }

                .preview-pop { animation: popIn 0.4s cubic-bezier(0.22,1,0.36,1); }

                .submit-btn {
                    transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
                }
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 14px 28px rgba(43,20,8,0.3);
                }
                .submit-btn:active:not(:disabled) {
                    transform: translateY(-1px) scale(0.98);
                }
                .submit-btn:disabled {
                    opacity: 0.75;
                    cursor: not-allowed;
                }

                .spin {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.4);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    vertical-align: middle;
                    margin-right: 8px;
                }

                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.001ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.001ms !important;
                    }
                }
            `}</style>

            <form
                onSubmit={handleSubmit}
                style={{
                    width: "100%",
                    maxWidth: "750px",
                    background: "#fff",
                    padding: "50px",
                    borderRadius: "30px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.1)",
                    opacity: loaded ? 1 : 0,
                    animation: loaded ? "formIn 0.6s cubic-bezier(0.22,1,0.36,1)" : "none",
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        fontSize: "55px",
                        color: "#2b1408",
                        marginBottom: "35px"
                    }}
                >
                    Customer Profile
                </h1>

                {/* MESSAGE */}
                {
                    message && (

                        <div
                            key={message}
                            className={`message-banner ${isSuccess ? "is-success" : "is-error"}`}
                            style={{
                                background: isSuccess ? "#d4edda" : "#f8d7da",
                                color: isSuccess ? "green" : "red",
                                padding: "15px",
                                borderRadius: "10px",
                                marginBottom: "25px",
                                textAlign: "center",
                                fontWeight: "600"
                            }}
                        >
                            {isSuccess && <span className="check-icon" style={{ display: "inline-block", marginRight: "8px" }}>✅</span>}
                            {message}
                        </div>
                    )
                }

                {/* IMAGE */}
                <div
                    style={{
                        marginBottom: "25px"
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            fontWeight: "600"
                        }}
                    >
                        Select Profile Photo
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-field"
                        style={inputStyle}
                    />

                </div>

                {/* PREVIEW */}
                {
                    preview && (

                        <div
                            className="preview-pop"
                            style={{
                                textAlign: "center",
                                marginBottom: "25px"
                            }}
                        >

                            <img
                                src={preview}
                                alt="preview"
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border:
                                        "5px solid #2b1408"
                                }}
                            />

                        </div>
                    )
                }

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-field"
                    style={inputStyle}
                />

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    style={{
                        ...inputStyle,
                        background: "#eee"
                    }}
                />

                <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    required
                    className="form-field"
                    style={inputStyle}
                />

                <textarea
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="form-field"
                    style={{
                        ...inputStyle,
                        resize: "none"
                    }}
                />

                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="form-field"
                    style={inputStyle}
                />

                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="form-field"
                    style={inputStyle}
                />

                <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    required
                    className="form-field"
                    style={inputStyle}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                    style={buttonStyle}
                >

                    {loading && <span className="spin" />}
                    {
                        loading
                            ? "Creating..."
                            : "Create Customer Profile"
                    }

                </button>

            </form>

        </div>
    );
};

const inputStyle = {

    width: "100%",

    padding: "18px",

    marginBottom: "22px",

    borderRadius: "14px",

    border: "1px solid #ccc",

    fontSize: "16px",

    outline: "none",

    boxSizing: "border-box"
};

const buttonStyle = {

    width: "100%",

    padding: "18px",

    background: "#2b1408",

    color: "#fff",

    border: "none",

    borderRadius: "14px",

    fontSize: "18px",

    cursor: "pointer",

    fontWeight: "600"
};

export default CustomerProfile;
