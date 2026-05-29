import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const navigate = useNavigate();

    const role =
        localStorage.getItem("role")?.toUpperCase();

    const email =
        localStorage.getItem("email");

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        // ONLY ORGANIZER
        if (role === "ORGANIZER") {

            fetch(
                `http://localhost:8082/api/organizer/${email}`
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
                                profile.profilePhoto
                                    ? `/images/${profile.profilePhoto}`
                                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
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