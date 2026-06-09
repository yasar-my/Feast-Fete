import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditOrganizerProfile = () => {
    
    const API2 = import.meta.env.VITE_PROFILE_URL;
    const CLUD = import.meta.env.VITE_CLUD_URL;

    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const [profileId, setProfileId] = useState(null);

    const [preview, setPreview] = useState("");

    const [formData, setFormData] = useState({
        profilePhoto: "",
        serviceName: "",
        name: "",
        location: "Tenkasi",
        email: email,
        mobile: "",
        foodType: "Veg",
        minPeople: "",
        maxPeople: "",
        menu: "",
        plateRate: ""
    });

    const [errors, setErrors] = useState({});

    // FETCH PROFILE
    useEffect(() => {

        fetch(`${API2}/api/organizer/${email}`)
            .then((res) => res.json())
            .then((data) => {

                setProfileId(data.id);

                setFormData(data);

                setPreview(data.profilePhoto);
            });

    }, [email]);

    // HANDLE CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        // SERVICE NAME & ORGANIZER NAME
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
            setErrors({
                ...errors,
                [name]: ""
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
            setErrors({
                ...errors,
                mobile: ""
            });

            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
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

            setErrors({
                ...errors,
                profilePhoto:
                    "Only JPG, JPEG, PNG, WEBP Images Allowed"
            });

            return;
        }

        if (file.size > 5 * 1024 * 1024) {

            setErrors({
                ...errors,
                profilePhoto:
                    "Image Size Must Be Below 5MB"
            });

            return;
        }

        const previewUrl =
            URL.createObjectURL(file);

        setPreview(previewUrl);
        try {

            const cloudinaryUrl =
                await uploadImageToCloudinary(file);

            setFormData(prev => ({
                ...prev,
                profilePhoto: cloudinaryUrl
            }));
            setErrors(prev => ({
                ...prev,
                profilePhoto: ""
            }));

        } catch (err) {

            console.log(err);

            setErrors(prev => ({
                ...prev,
                profilePhoto:
                    "Image Upload Failed"
            }));
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

        let newErrors = {};

        // MOBILE
        if (formData.mobile.length !== 10) {

            newErrors.mobile =
                "Mobile Number Must Be 10 Digits";
        }

        if (!/^[6-9]\d{9}$/.test(formData.mobile)) {

            newErrors.mobile =
                "Enter Valid 10 Digit Mobile Number";
        }

        // MIN PEOPLE
        if (Number(formData.minPeople) < 100) {

            newErrors.minPeople =
                "Minimum People Must Be Atleast 100";
        }

        // MAX PEOPLE
        if (Number(formData.maxPeople) > 10000) {

            newErrors.maxPeople =
                "Maximum People Must Be Below 10000";
        }

        if (
            Number(formData.maxPeople) <=
            Number(formData.minPeople)
        ) {

            newErrors.maxPeople =
                "Maximum People Must Be Greater Than Minimum People";
        }

        // PLATE RATE
        if (Number(formData.plateRate) < 50) {

            newErrors.plateRate =
                "Plate Rate Minimum ₹50";
        }

        // SHOW ERRORS
        if (Object.keys(newErrors).length > 0) {

            setErrors(newErrors);

            return;
        }

        // CLEAR ERRORS
        setErrors({});

        try {

            const response = await fetch(
                `${API2}/api/organizer/${profileId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {

                throw new Error("Update Failed");
            }

            navigate("/dashboard");

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f5f7",
                padding: "40px"
            }}
        >

            <form
                onSubmit={handleSubmit}
                style={{
                    width: "100%",
                    maxWidth: "750px",
                    background: "#fff",
                    padding: "40px",
                    borderRadius: "20px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                        fontSize: "48px"
                    }}
                >
                    Edit Organizer Profile
                </h1>

                {/* IMAGE */}
                <label style={labelStyle}>
                    Profile Photo
                </label>

                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageChange}
                    style={inputStyle}
                />
                {
                    errors.profilePhoto && (
                        <p style={errorStyle}>
                            {errors.profilePhoto}
                        </p>
                    )
                }

                {
                     (preview || formData.profilePhoto) && (

                        <img
                            src={preview || formData.profilePhoto}
                            alt="preview"
                            style={{
                                width: "120px",
                                height: "120px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginBottom: "20px"
                            }}
                        />
                    )
                }

                {/* SERVICE NAME */}
                <input
                    type="text"
                    name="serviceName"
                    placeholder="Service Name"
                    value={formData.serviceName}
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
                    style={inputStyle}
                >

                    <option value="Tenkasi">
                        Tenkasi
                    </option>

                    <option value="Sankarankovil">
                        Sankarankovil
                    </option>

                    <option value="Kadayanallur">
                        Kadayanallur
                    </option>

                    <option value="Courtallam">
                        Courtallam
                    </option>

                    <option value="Shenkottai">
                        Shenkottai
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
                        background: "#e9ecef",
                        cursor: "not-allowed"
                    }}
                />

                {/* MOBILE */}
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

                {
                    errors.mobile && (

                        <p style={errorStyle}>
                            {errors.mobile}
                        </p>
                    )
                }

                {/* FOOD TYPE */}
                <select
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleChange}
                    style={inputStyle}
                >

                    <option value="Veg">
                        Veg
                    </option>

                    <option value="Non-Veg">
                        Non-Veg
                    </option>

                    <option value="Chinese">
                        Chinese
                    </option>

                    <option value="South Indian">
                        South Indian
                    </option>

                    <option value="North Indian">
                        North Indian
                    </option>

                    <option value="BBQ">
                        BBQ
                    </option>
                    <option value="Sea Food">
                        Sea Food
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
                    min="100"
                    style={inputStyle}
                />

                {
                    errors.minPeople && (

                        <p style={errorStyle}>
                            {errors.minPeople}
                        </p>
                    )
                }

                {/* MAX PEOPLE */}
                <input
                    type="number"
                    name="maxPeople"
                    placeholder="Maximum People"
                    value={formData.maxPeople}
                    onChange={handleChange}
                    required
                    min="110"
                    style={inputStyle}
                />

                {
                    errors.maxPeople && (

                        <p style={errorStyle}>
                            {errors.maxPeople}
                        </p>
                    )
                }

                {/* MENU */}
                <textarea
                    name="menu"
                    placeholder="Menu Details"
                    value={formData.menu}
                    onChange={handleChange}
                    required
                    style={{
                        ...inputStyle,
                        height: "140px"
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
                    min="50"
                    style={inputStyle}
                />

                {
                    errors.plateRate && (

                        <p style={errorStyle}>
                            {errors.plateRate}
                        </p>
                    )
                }

                {/* BUTTON */}
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "18px",
                        background: "#2b1408",
                        color: "#fff",
                        border: "none",
                        borderRadius: "14px",
                        cursor: "pointer",
                        fontSize: "17px",
                        fontWeight: "600",
                        marginTop: "10px"
                    }}
                >
                    Update Profile
                </button>

            </form>

        </div>
    );
};

const inputStyle = {

    width: "100%",
    padding: "16px",
    marginBottom: "20px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    fontSize: "16px"
};

const labelStyle = {

    display: "block",
    marginBottom: "10px",
    fontWeight: "600"
};

const errorStyle = {

    color: "red",
    fontSize: "14px",
    marginTop: "-10px",
    marginBottom: "15px",
    fontWeight: "500"
};

export default EditOrganizerProfile;