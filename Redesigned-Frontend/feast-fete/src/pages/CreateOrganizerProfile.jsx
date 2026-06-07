import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateOrganizerProfile = () => {

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({

        profilePhoto: "",
        serviceName: "",
        name: "",
        location: "",
        email: localStorage.getItem("email") || "",
        mobile: "",
        foodType: "",
        minPeople: "",
        maxPeople: "",
        menu: "",
        plateRate: ""
    });

    const [preview, setPreview] = useState("");

    // INPUT CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        setError("");

        // MOBILE ONLY NUMBER
        if (name === "mobile") {

            const onlyNums = value.replace(/\D/g, "");

            setFormData({
                ...formData,
                mobile: onlyNums
            });

            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // IMAGE CHANGE
    const handleImageChange = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const previewUrl =
            URL.createObjectURL(file);

        setPreview(previewUrl);

        try {

            const imageUrl =
                await uploadImageToCloudinary(file);

            console.log(
                "Cloudinary URL =",
                imageUrl
            );

            setFormData(prev => ({
                ...prev,
                profilePhoto: imageUrl
            }));

        } catch (error) {

            console.log(error);

            alert(
                "Image Upload Failed"
            );
        }
    };

    const uploadImageToCloudinary = async (file) => {

        const data = new FormData();

        data.append("file", file);

        data.append(
            "upload_preset",
            "feast_fete_upload"
        );

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dmytd1bjy/image/upload",
            {
                method: "POST",
                body: data
            }
        );

        const result = await response.json();

        return result.secure_url;
    };

    // SUBMIT
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // MOBILE VALIDATION
        if (formData.mobile.length !== 10) {

            setError(
                "Mobile Number Must Be 10 Digits"
            );

            return;
        }

        // MIN PEOPLE VALIDATION
        if (
            Number(formData.minPeople) < 100
        ) {

            setError(
                "Minimum People Must Be Atleast 100"
            );

            return;
        }

        // MAX PEOPLE VALIDATION
        if (
            Number(formData.maxPeople) > 10000
        ) {

            setError(
                "Maximum People Must Be Below 10000"
            );

            return;
        }

        // PLATE RATE VALIDATION
        if (
            Number(formData.plateRate) < 50
        ) {

            setError(
                "Plate Rate Minimum ₹50"
            );

            return;
        }

        try {

            console.log(
                "SENDING =",
                formData
            );

            const response = await fetch(
                "http://localhost:8082/api/organizer/create",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        formData
                    )
                }
            );

            // BACKEND ERROR
            if (!response.ok) {

                const errorText =
                    await response.text();

                console.log(
                    "BACKEND ERROR =",
                    errorText
                );

                setError(
                    errorText ||
                    "Backend Server Error"
                );

                return;
            }

            const data =
                await response.json();

            console.log(
                "SUCCESS =",
                data
            );

            // SAVE PROFILE ID
            localStorage.setItem(
                "organizerProfileId",
                data.id
            );

            alert(
                "Organizer Profile Created Successfully"
            );

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            setError(
                "Server Connection Failed"
            );
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f5f2ed",
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
                        "0 10px 40px rgba(0,0,0,0.08)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        fontSize: "60px",
                        marginBottom: "40px",
                        color: "#2b1408"
                    }}
                >
                    Create Organizer Profile
                </h1>

                {/* ERROR MESSAGE */}
                {
                    error && (

                        <div
                            style={{
                                background: "#ffe5e5",
                                color: "#d00000",
                                padding: "14px",
                                borderRadius: "10px",
                                marginBottom: "20px",
                                fontWeight: "600",
                                textAlign: "center"
                            }}
                        >
                            {error}
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
                            fontWeight: "600",
                            display: "block",
                            marginBottom: "10px"
                        }}
                    >
                        Select Profile Photo
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={
                            handleImageChange
                        }
                        required
                        style={fileInput}
                    />

                </div>

                {/* IMAGE PREVIEW */}
                {
                    preview && (

                        <div
                            style={{
                                marginBottom: "25px",
                                textAlign: "center"
                            }}
                        >

                            <img
                                src={preview}
                                alt="preview"
                                style={{
                                    width: "160px",
                                    height: "160px",
                                    borderRadius: "20px",
                                    objectFit: "cover",
                                    border:
                                        "4px solid #2b1408"
                                }}
                            />

                        </div>
                    )
                }

                {/* SERVICE NAME */}
                <input
                    type="text"
                    name="serviceName"
                    placeholder="Service Name"
                    value={
                        formData.serviceName
                    }
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                {/* NAME */}
                <input
                    type="text"
                    name="name"
                    placeholder="Organizer Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                {/* LOCATION */}
                <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                >

                    <option value="">
                        Select Tenkasi Area
                    </option>

                    <option value="Tenkasi">
                        Tenkasi
                    </option>

                    <option value="Shenkottai">
                        Shenkottai
                    </option>

                    <option value="Courtallam">
                        Courtallam
                    </option>

                    <option value="Kadayanallur">
                        Kadayanallur
                    </option>

                    <option value="Sankarankovil">
                        Sankarankovil
                    </option>

                    <option value="Alangulam">
                        Alangulam
                    </option>

                    <option value="Puliyangudi">
                        Puliyangudi
                    </option>

                    <option value="Surandai">
                        Surandai
                    </option>

                </select>

                {/* EMAIL */}
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    style={{
                        ...inputStyle,
                        background: "#f2f2f2"
                    }}
                />

                {/* MOBILE */}
                <input
                    type="text"
                    name="mobile"
                    placeholder="Enter 10 Digit Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    required
                    style={inputStyle}
                />

                {/* FOOD TYPE */}
                <select
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                >

                    <option value="">
                        Select Food Type
                    </option>

                    <option value="Veg">
                        Veg
                    </option>

                    <option value="Non-Veg">
                        Non-Veg
                    </option>

                    <option value="Chinese">
                        Chinese
                    </option>

                    <option value="BBQ">
                        BBQ
                    </option>

                    <option value="Sea Food">
                        Sea Food
                    </option>

                    <option value="South Indian">
                        South Indian
                    </option>

                    <option value="North Indian">
                        North Indian
                    </option>

                    <option value="Arabian">
                        Arabian
                    </option>

                </select>

                {/* MIN PEOPLE */}
                <input
                    type="number"
                    name="minPeople"
                    placeholder="Minimum People"
                    value={formData.minPeople}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                {/* MAX PEOPLE */}
                <input
                    type="number"
                    name="maxPeople"
                    placeholder="Maximum People"
                    value={formData.maxPeople}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                {/* MENU */}
                <textarea
                    name="menu"
                    placeholder="Menu Items"
                    value={formData.menu}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{
                        ...inputStyle,
                        resize: "none"
                    }}
                />

                {/* PLATE RATE */}
                <input
                    type="number"
                    name="plateRate"
                    placeholder="Plate Rate"
                    value={formData.plateRate}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                {/* BUTTON */}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "18px",
                        background: "#2b1408",
                        color: "#fff",
                        border: "none",
                        borderRadius: "15px",
                        fontSize: "18px",
                        cursor: "pointer",
                        marginTop: "20px",
                        fontWeight: "600"
                    }}
                >
                    Create Organizer Profile
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
    boxSizing: "border-box",
    outline: "none"
};

const fileInput = {

    width: "100%",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "14px",
    background: "#fff"
};

export default CreateOrganizerProfile;