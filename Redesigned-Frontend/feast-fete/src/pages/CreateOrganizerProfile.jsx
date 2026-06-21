import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateOrganizerProfile = () => {

    const API2 = import.meta.env.VITE_PROFILE_URL;
    const CLUD = import.meta.env.VITE_CLUD_URL;

    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

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

    // mount entrance
    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(t);
    }, []);

    // INPUT CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        setError("");

        if (
            name === "serviceName" ||
            name === "name"
        ) {

            const onlyLetters =
                value.replace(
                    /[^a-zA-Z\u0B80-\u0BFF\s]/g,
                    ""
                );

            setFormData({
                ...formData,
                [name]: onlyLetters
            });

            return;
        }

        // MOBILE ONLY NUMBER
        if (name === "mobile") {

            const onlyNums =
                value.replace(/\D/g, "");

            if (onlyNums.length > 10) return;

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

        const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, JPEG, PNG, WEBP Images Allowed");
        return;
        }

        // MAX 5MB
        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Image Size Must Be Below 5MB"
            );

            return;
        }

        setError("");

        const previewUrl =
            URL.createObjectURL(file);

        setPreview(previewUrl);
        setUploading(true);

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
        } finally {
            setUploading(false);
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
            `${CLUD}/v1_1/dmytd1bjy/image/upload`,
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
        if (!/^[6-9]\d{9}$/.test(formData.mobile)) {

            setError(
                "Enter Valid 10 Digit Mobile Number"
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
        if (
            Number(formData.maxPeople) <=
            Number(formData.minPeople)
        ) {

            setError(
                "Maximum People Must Be Greater Than Minimum People"
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

        setSubmitting(true);

        try {

            console.log(
                "SENDING =",
                formData
            );

            const response = await fetch(
                `${API2}/api/organizer/create`,
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
        } finally {
            setSubmitting(false);
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

                .form-field {
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                .form-field:focus {
                    outline: none;
                    border-color: #b8860b !important;
                    box-shadow: 0 0 0 4px rgba(184,134,11,0.16);
                }

                .error-banner { animation: shake 0.5s ease; }

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

                .upload-spinner {
                    width: 30px;
                    height: 30px;
                    border: 3px solid rgba(255,255,255,0.4);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
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
                        "0 10px 40px rgba(0,0,0,0.08)",
                    opacity: loaded ? 1 : 0,
                    animation: loaded ? "formIn 0.6s cubic-bezier(0.22,1,0.36,1)" : "none",
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
                            key={error}
                            className="error-banner"
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
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={
                            handleImageChange
                        }
                        required
                        className="form-field"
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

                            <div
                                style={{
                                    position: "relative",
                                    display: "inline-block",
                                    animation: "popIn 0.4s cubic-bezier(0.22,1,0.36,1)",
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
                                        border: "4px solid #2b1408",
                                        filter: uploading ? "brightness(0.6)" : "none",
                                        transition: "filter 0.3s ease",
                                        display: "block",
                                    }}
                                />

                                {uploading && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <div className="upload-spinner" />
                                    </div>
                                )}
                            </div>

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
                    className="form-field"
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
                    className="form-field"
                    style={inputStyle}
                />

                {/* LOCATION */}
                <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="form-field"
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
                    type="tel"
                    inputMode="numeric"
                    name="mobile"
                    placeholder="Enter 10 Digit Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    required
                    className="form-field"
                    style={inputStyle}
                />

                {/* FOOD TYPE */}
                <select
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleChange}
                    required
                    className="form-field"
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
                    className="form-field"
                    style={inputStyle}
                    min="100"
                />

                {/* MAX PEOPLE */}
                <input
                    type="number"
                    name="maxPeople"
                    placeholder="Maximum People"
                    value={formData.maxPeople}
                    onChange={handleChange}
                    required
                    className="form-field"
                    style={inputStyle}
                    min="110"
                />

                {/* MENU */}
                <textarea
                    name="menu"
                    placeholder="Menu Items"
                    value={formData.menu}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="form-field"
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
                    className="form-field"
                    style={inputStyle}
                    min="50"
                />

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="submit-btn"
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
                    {submitting && <span className="spin" />}
                    {submitting ? "Creating Profile..." : "Create Organizer Profile"}
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
