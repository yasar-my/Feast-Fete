import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Organizers = () => {

    const [organizers, setOrganizers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        fetch("http://localhost:8082/api/organizer/all")

            .then((res) => {

                if (!res.ok) {
                    throw new Error("Failed to fetch organizers");
                }

                return res.json();
            })

            .then((data) => {

                console.log(data);

                setOrganizers(data);

                setLoading(false);
            })

            .catch((err) => {

                console.log(err);

                setError("Unable to load organizers");

                setLoading(false);
            });

    }, []);

    // LOADING
    if (loading) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "28px",
                    color: "#2b1408"
                }}
            >
                Loading Organizers...
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
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    background: "#f8f5f0"
                }}
            >

                <h1
                    style={{
                        color: "red",
                        marginBottom: "20px"
                    }}
                >
                    {error}
                </h1>

                <p
                    style={{
                        color: "#555"
                    }}
                >
                    Please check backend server
                </p>

            </div>
        );
    }

    // EMPTY
    if (organizers.length === 0) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "30px",
                    color: "#2b1408"
                }}
            >
                No Organizers Found
            </div>
        );
    }

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f8f5f0",
                padding: "60px 5%"
            }}
        >

            {/* TITLE */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "60px"
                }}
            >

                <p
                    style={{
                        letterSpacing: "4px",
                        color: "#b88949",
                        fontSize: "13px",
                        textTransform: "uppercase"
                    }}
                >
                    Premium Catering Partners
                </p>

                <h1
                    style={{
                        fontSize: "64px",
                        color: "#2b1408",
                        fontFamily:
                            "'Cormorant Garamond', serif",
                        marginTop: "10px"
                    }}
                >
                    Explore Organizers
                </h1>

            </div>

            {/* CARDS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(350px,1fr))",
                    gap: "35px"
                }}
            >

                {
                    organizers.map((organizer) => (

                        <div
                            key={organizer.id}
                            style={{
                                background: "#fff",
                                borderRadius: "24px",
                                overflow: "hidden",
                                boxShadow:
                                    "0 10px 30px rgba(0,0,0,0.08)"
                            }}
                        >

                            {/* IMAGE */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    padding: "25px"
                                }}
                            >
                                <img
                                    src={
                                        organizer.profilePhoto ||
                                        "https://images.unsplash.com/photo-1555244162-803834f70033"
                                    }
                                    alt={organizer.name}
                                    style={{
                                        width: "170px",
                                        height: "170px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "5px solid #2b1408"
                                    }}
                                />
                            </div>

                            {/* CONTENT */}
                            <div
                                style={{
                                    padding: "30px"
                                }}
                            >

                                <h2
                                    style={{
                                        color: "#2b1408",
                                        marginBottom: "10px",
                                        fontSize: "30px"
                                    }}
                                >
                                    {organizer.serviceName}
                                </h2>

                                <p
                                    style={{
                                        color: "#666",
                                        marginBottom: "10px"
                                    }}
                                >
                                    👨‍🍳 {organizer.name}
                                </p>

                                <p
                                    style={{
                                        color: "#666",
                                        marginBottom: "10px"
                                    }}
                                >
                                    📍 {organizer.location}
                                </p>

                                <p
                                    style={{
                                        color: "#666",
                                        marginBottom: "10px"
                                    }}
                                >
                                    🍽 {organizer.foodType}
                                </p>

                                <p
                                    style={{
                                        color: "#666",
                                        marginBottom: "10px"
                                    }}
                                >
                                    👥 {organizer.minPeople} -
                                    {organizer.maxPeople} People
                                </p>

                                <p
                                    style={{
                                        color: "#b88949",
                                        marginBottom: "20px",
                                        fontWeight: "600",
                                        fontSize: "18px"
                                    }}
                                >
                                    ₹ {organizer.plateRate} / Plate
                                </p>

                                {/* MENU */}
                                <div
                                    style={{
                                        background: "#f8f5f0",
                                        padding: "18px",
                                        borderRadius: "14px",
                                        marginBottom: "25px"
                                    }}
                                >

                                    <h3
                                        style={{
                                            marginBottom: "12px",
                                            color: "#2b1408"
                                        }}
                                    >
                                        Menu
                                    </h3>

                                    <p
                                        style={{
                                            color: "#555",
                                            lineHeight: "1.8"
                                        }}
                                    >
                                        {organizer.menu}
                                    </p>

                                </div>

                                {/* BUTTON */}
                                <Link
                                    to={`/organizer/${encodeURIComponent(organizer.email)}`}
                                    style={{
                                        textDecoration: "none"
                                    }}
                                >

                                    <button
                                        style={{
                                            width: "100%",
                                            padding: "15px",
                                            background: "#2b1408",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            letterSpacing: "1px"
                                        }}
                                    >
                                        View Details
                                    </button>

                                </Link>

                            </div>

                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default Organizers;