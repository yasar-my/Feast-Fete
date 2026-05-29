import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerProfile = () => {

    const navigate = useNavigate();

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
                "http://localhost:8082/api/customer/create",
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

            <form
                onSubmit={handleSubmit}
                style={{
                    width: "100%",
                    maxWidth: "750px",
                    background: "#fff",
                    padding: "50px",
                    borderRadius: "30px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.1)"
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
                            style={{
                                background:
                                    message.includes(
                                        "Successfully"
                                    )
                                        ? "#d4edda"
                                        : "#f8d7da",

                                color:
                                    message.includes(
                                        "Successfully"
                                    )
                                        ? "green"
                                        : "red",

                                padding: "15px",

                                borderRadius: "10px",

                                marginBottom: "25px",

                                textAlign: "center",

                                fontWeight: "600"
                            }}
                        >
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
                        style={inputStyle}
                    />

                </div>

                {/* PREVIEW */}
                {
                    preview && (

                        <div
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
                    style={inputStyle}
                />

                <textarea
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={4}
                    required
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
                    style={inputStyle}
                />

                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
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
                    style={inputStyle}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={buttonStyle}
                >

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