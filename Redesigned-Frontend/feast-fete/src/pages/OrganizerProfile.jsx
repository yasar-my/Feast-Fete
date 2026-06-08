import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrganizerProfile = () => {

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const email =
            localStorage.getItem("email");

        console.log("EMAIL =", email);

        // EMAIL CHECK
        if (!email || email === "undefined") {

            alert("Login Again");

            navigate("/login");

            return;
        }

        // FETCH PROFILE
        fetch(
            `https://feast-fete-1.onrender.com/api/organizer/${email}`
        )
            .then(async (res) => {

                if (!res.ok) {

                    throw new Error(
                        "Profile Not Found"
                    );
                }

                return res.json();
            })

            .then((data) => {

                console.log("PROFILE =", data);

                setProfile(data);

                localStorage.setItem(
                    "organizerProfileId",
                    data.id
                );
            })

            .catch((err) => {

                console.log(err);

                alert("Failed To Load Profile");
            })

            .finally(() => {

                setLoading(false);
            });

    }, [navigate]);

    // LOADING
    if (loading) {

        return (

            <h1
                style={{
                    textAlign: "center",
                    marginTop: "100px"
                }}
            >
                Loading...
            </h1>
        );
    }

    // NO PROFILE
    if (!profile) {

        return (

            <h1
                style={{
                    textAlign: "center",
                    marginTop: "100px"
                }}
            >
                No Organizer Profile Found
            </h1>
        );
    }

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
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow:
                        "0 5px 20px rgba(0,0,0,0.1)"
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
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="profile"
                        style={{
                            width: "180px",
                            height: "180px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border:
                                "5px solid #2b1408"
                        }}
                    />

                    <h1
                        style={{
                            marginTop: "20px",
                            fontSize: "50px",
                            color: "#2b1408"
                        }}
                    >
                        {profile.serviceName}
                    </h1>

                    <h2
                        style={{
                            color: "#666"
                        }}
                    >
                        {profile.name}
                    </h2>

                </div>

                {/* DETAILS */}
                <div
                    style={{
                        marginTop: "40px",
                        lineHeight: "2.2",
                        fontSize: "18px"
                    }}
                >

                    <p>
                        <b>Location :</b>
                        {" "}
                        {profile.location}
                    </p>

                    <p>
                        <b>Email :</b>
                        {" "}
                        {profile.email}
                    </p>

                    <p>
                        <b>Mobile :</b>
                        {" "}
                        {profile.mobile}
                    </p>

                    <p>
                        <b>Food Type :</b>
                        {" "}
                        {profile.foodType}
                    </p>

                    <p>
                        <b>Minimum People :</b>
                        {" "}
                        {profile.minPeople}
                    </p>

                    <p>
                        <b>Maximum People :</b>
                        {" "}
                        {profile.maxPeople}
                    </p>

                    <p>
                        <b>Plate Rate :</b>
                        {" "}
                        ₹{profile.plateRate}
                    </p>

                    <p>
                        <b>Menu :</b>
                        {" "}
                        {profile.menu}
                    </p>

                </div>

                {/* BUTTON */}
                <button
                    onClick={() =>
                        navigate(
                            "/edit-organizer-profile"
                        )
                    }
                    style={{
                        width: "100%",
                        padding: "18px",
                        background: "#2b1408",
                        color: "#fff",
                        border: "none",
                        borderRadius: "14px",
                        fontSize: "18px",
                        cursor: "pointer",
                        marginTop: "30px"
                    }}
                >
                    Edit Profile
                </button>

            </div>

        </div>
    );
};

export default OrganizerProfile;