import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditOrganizerProfile = () => {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");

    const [profileId, setProfileId] = useState(null);

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

        fetch(`http://localhost:8082/api/organizer/${email}`)
            .then((res) => res.json())
            .then((data) => {

                setProfileId(data.id);

                setFormData(data);
            });

    }, [email]);

    // HANDLE CHANGE
    const handleChange = (e) => {

        const { name, value } = e.target;

        // MOBILE ONLY NUMBER
        if (name === "mobile") {

            if (!/^\d*$/.test(value)) return;

            if (value.length > 10) return;
        }

        setFormData({
            ...formData,
            [name]: value
        });

        // ERROR REMOVE AFTER TYPING
        setErrors({
            ...errors,
            [name]: ""
        });
    };

    // IMAGE CHANGE
    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);

        setFormData({
            ...formData,
            profilePhoto: imageUrl
        });
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
                `http://localhost:8082/api/organizer/${profileId}`,
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
                    accept="image/*"
                    onChange={handleImageChange}
                    style={inputStyle}
                />

                {
                    formData.profilePhoto && (

                        <img
                            src={formData.profilePhoto}
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