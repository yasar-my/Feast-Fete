import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const API2 = import.meta.env.VITE_PROFILE_URL;
    const CLUD = import.meta.env.VITE_CLUD_URL;

    const navigate = useNavigate();

    const role =
        localStorage.getItem("role")?.toUpperCase();

    const email =
        localStorage.getItem("email");

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [foodImages, setFoodImages] = useState([]);

    const [selectedImage, setSelectedImage] =
    useState(null);


    const handleFoodImages = (e) => {

        setFoodImages(
            Array.from(e.target.files)
        );
    };


    const uploadFoodImages = async () => {

        const urls = [];

        for (const file of foodImages) {

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

            const result =
                await response.json();

            urls.push(result.secure_url);
        }

        const existingImages =
            profile.foodImages
                ? profile.foodImages.split(",")
                : [];

        const updatedProfile = {

            ...profile,

            foodImages: [
                ...existingImages,
                ...urls
            ].join(",")
        };

        setProfile(updatedProfile);

        await fetch(
            `${API2}/api/organizer/${profile.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify(
                    updatedProfile
                )
            }
        );

        console.log(updatedProfile);
    };


    const deleteImage = async (index) => {

        const images =
            profile.foodImages.split(",");

        const updatedImages =
            images.filter(
                (_, i) => i !== index
            );

        const updatedProfile = {

            ...profile,

            foodImages:
                updatedImages.join(",")
        };

        setProfile(updatedProfile);

        await fetch(
            `${API2}/api/organizer/${profile.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(
                    updatedProfile
                )
            }
        );
    };

    useEffect(() => {

        // ONLY ORGANIZER
        if (role === "ORGANIZER") {

            fetch(
                `${API2}/api/organizer/${email}`
            )
                .then(async (res) => {

                    if (!res.ok) {

                        throw new Error(
                            "Organizer Profile Not Found"
                        );
                    }

                    return res.json();
                })

                .then((data) => {

                    console.log("PROFILE =", data);

                    setProfile(data);

                    setLoading(false);
                })

                .catch((err) => {

                    console.log(err);

                    setError(
                        "Organizer Profile Not Found"
                    );

                    setLoading(false);
                });
        }

        else {

            setLoading(false);
        }

    }, [email, role]);

    // LOADING
    if (loading) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "35px",
                    fontWeight: "bold"
                }}
            >
                Loading...
            </div>
        );
    }

    // ERROR
    if (error) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px"
                }}
            >

                <h1
                    style={{
                        color: "red"
                    }}
                >
                    {error}
                </h1>

                <button
                    onClick={() =>
                        navigate(
                            "/create-organizer-profile"
                        )
                    }
                    style={{
                        padding: "15px 30px",
                        border: "none",
                        background: "#2b1408",
                        color: "#fff",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    Create Profile
                </button>

            </div>
        );
    }

    // ORGANIZER DASHBOARD
    if (role === "ORGANIZER" && profile) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    background: "#f5f5f7",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "40px"
                }}
            >

                <div
                    style={{
                        width: "100%",
                        maxWidth: "850px",
                        background: "#fff",
                        borderRadius: "25px",
                        padding: "45px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.1)"
                    }}
                >

                    {/* IMAGE */}
                    <div
                        style={{
                            textAlign: "center"
                        }}
                    >

                        <img
                            src={
                                profile.profilePhoto ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt="profile"
                            style={{
                                width: "180px",
                                height: "180px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "5px solid #2b1408"
                            }}
                        />

                        <h1
                            style={{
                                marginTop: "25px",
                                fontSize: "50px",
                                color: "#2b1408"
                            }}
                        >
                            {profile.serviceName}
                        </h1>

                        <h2
                            style={{
                                color: "#666",
                                marginTop: "10px"
                            }}
                        >
                            {profile.name}
                        </h2>

                    </div>

                    {/* DETAILS */}
                    <div
                        style={{
                            marginTop: "40px",
                            lineHeight: "2.3",
                            fontSize: "18px"
                        }}
                    >

                        <p>
                            <b>Location :</b>{" "}
                            {profile.location}
                        </p>

                        <p>
                            <b>Email :</b>{" "}
                            {profile.email}
                        </p>

                        <p>
                            <b>Mobile :</b>{" "}
                            {profile.mobile}
                        </p>

                        <p>
                            <b>Food Type :</b>{" "}
                            {profile.foodType}
                        </p>

                        <p>
                            <b>Minimum People :</b>{" "}
                            {profile.minPeople}
                        </p>

                        <p>
                            <b>Maximum People :</b>{" "}
                            {profile.maxPeople}
                        </p>

                        <p>
                            <b>Plate Rate :</b>{" "}
                            ₹{profile.plateRate}
                        </p>

                        <p>
                            <b>Menu :</b>{" "}
                            {profile.menu}
                        </p>

                    </div>

                    {/* BUTTONS */}
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            marginTop: "35px"
                        }}
                    >

                        <button
                            onClick={() =>
                                navigate(
                                    "/edit-organizer-profile"
                                )
                            }
                            style={buttonStyle}
                        >
                            Edit Profile
                        </button>

                        <button
                            onClick={() => {

                                localStorage.clear();

                                navigate("/login");
                            }}
                            style={{
                                ...buttonStyle,
                                background: "red"
                            }}
                        >
                            Logout
                        </button>

                    </div>

                    <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFoodImages}
                        />

                        <button
                            onClick={uploadFoodImages}
                            style={buttonStyle}
                        >
                            Add Images
                        </button>

                        {
                            profile.foodImages && (

                                <div
                                    style={{
                                        marginTop: "30px"
                                    }}
                                >
                                    <h2>Food Gallery</h2>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fill,minmax(180px,1fr))",
                                            gap: "15px",
                                            marginTop: "15px"
                                        }}
                                    >

                                        {
                                            profile.foodImages
                                                .split(",")
                                                .map((img, index) => (

                                                    <div
                                                        key={index}
                                                        style={{
                                                            position: "relative"
                                                        }}
                                                    >

                                                        <img
                                                            src={img}
                                                            alt="food"
                                                            onClick={() =>
                                                                setSelectedImage(img)
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                height: "180px",
                                                                objectFit: "cover",
                                                                borderRadius: "12px",
                                                                cursor: "pointer"
                                                            }}
                                                        />

                                                        <button
                                                            onClick={() =>
                                                                deleteImage(index)
                                                            }
                                                            style={{
                                                                position: "absolute",
                                                                top: "8px",
                                                                right: "8px",
                                                                background: "red",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "50%",
                                                                width: "30px",
                                                                height: "30px",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            X
                                                        </button>

                                                    </div>

                                                ))
                                        }

                                        {
                                            selectedImage && (

                                                <div
                                                    onClick={() =>
                                                        setSelectedImage(null)
                                                    }
                                                    style={{
                                                        position: "fixed",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        background:
                                                            "rgba(0,0,0,0.8)",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        zIndex: 9999
                                                    }}
                                                >

                                                    <img
                                                        src={selectedImage}
                                                        alt="preview"
                                                        style={{
                                                            maxWidth: "80%",
                                                            maxHeight: "80%",
                                                            borderRadius: "20px"
                                                        }}
                                                    />

                                                </div>

                                            )
                                        }

                                    </div>

                                </div>
                            )
                        }

                </div>

            </div>
        );
    }

    // CUSTOMER DASHBOARD
    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f7",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <div
                style={{
                    background: "#fff",
                    padding: "50px",
                    borderRadius: "20px",
                    boxShadow:
                        "0 10px 25px rgba(0,0,0,0.1)",
                    textAlign: "center"
                }}
            >

                <h1
                    style={{
                        fontSize: "55px",
                        color: "#2b1408"
                    }}
                >
                    Welcome Customer
                </h1>

                <p
                    style={{
                        marginTop: "15px",
                        color: "#666",
                        fontSize: "18px"
                    }}
                >
                    Book Best Catering Services
                </p>

            </div>

        </div>
    );
};

const buttonStyle = {

    flex: 1,

    padding: "18px",

    background: "#2b1408",

    color: "#fff",

    border: "none",

    borderRadius: "14px",

    fontSize: "18px",

    cursor: "pointer",

    fontWeight: "600"
};

export default Dashboard;