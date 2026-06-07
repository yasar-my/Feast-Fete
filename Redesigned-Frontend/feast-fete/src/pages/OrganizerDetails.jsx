import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrganizerDetails = () => {

    const { email } = useParams();

    const [organizer, setOrganizer] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showBooking, setShowBooking] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);

    const [bookingData, setBookingData] = useState({

        customerName: "",

        customerEmail: "",

        customerMobile: "",

        customerAddress: "",

        eventDate: "",

        mealType: "",

        guestCount: ""
    });

    // FETCH ORGANIZER
    useEffect(() => {

        if (!email) {

            setError("Organizer email not found");

            setLoading(false);

            return;
        }

        fetch(
            `http://localhost:8082/api/organizer/${encodeURIComponent(email)}`
        )

            .then((res) => {

                if (!res.ok) {
                    throw new Error("Failed to fetch organizer");
                }

                return res.json();
            })

            .then((data) => {

                console.log(data);

                setOrganizer(data);

                setLoading(false);
            })

            .catch((err) => {

                console.log(err);

                setError("Unable to load organizer");

                setLoading(false);
            });

    }, [email]);

    // INPUT CHANGE
    const handleChange = (e) => {

        setBookingData({

            ...bookingData,

            [e.target.name]: e.target.value
        });
    };

    // BOOKING
    const handleBooking = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8083/api/booking/create",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        ...bookingData,

                        organizerEmail: organizer.email,

                        plateRate: organizer.plateRate,

                        totalAmount:
                            organizer.plateRate *
                            bookingData.guestCount,

                        advanceAmount:
                            (
                                organizer.plateRate *
                                bookingData.guestCount
                            ) * 0.3
                    })
                }
            );

            if (!response.ok) {

                throw new Error("Booking failed");
            }

            alert("Booking Created Successfully 🔥");

            setShowBooking(false);

            setBookingData({

                customerName: "",

                customerEmail: "",

                customerMobile: "",

                customerAddress: "",

                eventDate: "",

                mealType: "",

                guestCount: ""
            });

        } catch (error) {

            console.log(error);

            alert("Booking Failed");
        }
    };

    // LOADING
    if (loading) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "24px"
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
                    justifyContent: "center",
                    alignItems: "center",
                    color: "red",
                    fontSize: "24px"
                }}
            >
                {error}
            </div>
        );
    }

    // NO DATA
    if (!organizer) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "24px"
                }}
            >
                Organizer Not Found
            </div>
        );
    }

    return (

        <>
            <div
                style={{
                    minHeight: "100vh",
                    background: "#f8f5f0",
                    padding: "50px 8%"
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
                        background: "#fff",
                        padding: "40px",
                        borderRadius: "24px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                    }}
                >

                    <h1
                        style={{
                            fontSize: "48px",
                            color: "#2b1408",
                            marginBottom: "10px"
                        }}
                    >
                        {organizer.serviceName}
                    </h1>

                    <h2
                        style={{
                            color: "#666",
                            marginBottom: "20px"
                        }}
                    >
                        👨‍🍳 {organizer.name}
                    </h2>

                    <p
                        style={{
                            marginBottom: "12px",
                            fontSize: "18px"
                        }}
                    >
                        📍 {organizer.location}
                    </p>

                    <p
                        style={{
                            marginBottom: "12px",
                            fontSize: "18px"
                        }}
                    >
                        🍽 {organizer.foodType}
                    </p>

                    <p
                        style={{
                            marginBottom: "12px",
                            fontSize: "18px"
                        }}
                    >
                        👥 {organizer.minPeople} - {organizer.maxPeople} People
                    </p>

                    <p
                        style={{
                            marginBottom: "12px",
                            fontSize: "18px"
                        }}
                    >
                        📞 {organizer.mobile}
                    </p>

                    <p
                        style={{
                            marginBottom: "12px",
                            fontSize: "18px"
                        }}
                    >
                        ✉️ {organizer.email}
                    </p>

                    <p
                        style={{
                            marginBottom: "30px",
                            fontSize: "24px",
                            color: "#b88949",
                            fontWeight: "bold"
                        }}
                    >
                        ₹ {organizer.plateRate} / Plate
                    </p>

                    {/* BUTTON */}
                    <button
                        onClick={() => setShowBooking(true)}
                        style={{
                            padding: "15px 30px",
                            background: "#2b1408",
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            marginBottom: "30px",
                            fontSize: "16px",
                            fontWeight: "600"
                        }}
                    >
                        Book Now
                    </button>

                    {/* MENU */}
                    <div
                        style={{
                            background: "#f8f5f0",
                            padding: "25px",
                            borderRadius: "18px"
                        }}
                    >

                        <h2
                            style={{
                                marginBottom: "20px",
                                color: "#2b1408"
                            }}
                        >
                            Menu Details
                        </h2>

                        <p
                            style={{
                                lineHeight: "2",
                                color: "#555",
                                whiteSpace: "pre-line"
                            }}
                        >
                            {organizer.menu}
                        </p>

                    </div>

                    {/* FOOD GALLERY */}

                    {
                        organizer.foodImages && (

                            <div
                                style={{
                                    marginTop: "40px"
                                }}
                            >

                                <h2
                                    style={{
                                        marginBottom: "20px",
                                        color: "#2b1408"
                                    }}
                                >
                                    Food Gallery
                                </h2>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit,minmax(220px,1fr))",
                                        gap: "20px"
                                    }}
                                >

                                    {
                                        organizer.foodImages
                                            .split(",")
                                            .map((img, index) => (

                                                <img
                                                    src={img}
                                                    alt="food"
                                                    onClick={() => setSelectedImage(img)}
                                                    style={{
                                                        width: "100%",
                                                        height: "250px",
                                                        objectFit: "cover",
                                                        borderRadius: "15px",
                                                        cursor: "pointer"
                                                    }}
                                                />

                                            ))
                                    }
                                    

                                </div>

                            </div>
                        )
                    }

                </div>

            </div>

            {/* BOOKING POPUP */}
            {
                showBooking && (

                    <div
                        style={{
                            position: "fixed",
                            inset: "0",
                            background: "rgba(0,0,0,0.6)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: "999"
                        }}
                    >

                        <form
                            onSubmit={handleBooking}
                            style={{
                                background: "#fff",
                                padding: "40px",
                                borderRadius: "24px",
                                width: "450px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "18px"
                            }}
                        >

                            <h2>Book Catering</h2>

                            <input
                                type="text"
                                name="customerName"
                                placeholder="Your Name"
                                value={bookingData.customerName}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="email"
                                name="customerEmail"
                                placeholder="Your Email"
                                value={bookingData.customerEmail}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="customerMobile"
                                placeholder="Mobile Number"
                                value={bookingData.customerMobile}
                                onChange={handleChange}
                                required
                            />

                            <textarea
                                name="customerAddress"
                                placeholder="Event Address"
                                value={bookingData.customerAddress}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="date"
                                name="eventDate"
                                value={bookingData.eventDate}
                                onChange={handleChange}
                                required
                            />

                            <select
                                name="mealType"
                                value={bookingData.mealType}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Meal Type
                                </option>

                                <option value="Veg">
                                    Veg
                                </option>

                                <option value="Non-Veg">
                                    Non Veg
                                </option>

                                <option value="Veg & Non-Veg">
                                    Veg & Non Veg
                                </option>

                            </select>

                            <input
                                type="number"
                                name="guestCount"
                                placeholder="Guest Count"
                                value={bookingData.guestCount}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="submit"
                                style={{
                                    padding: "14px",
                                    background: "#2b1408",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                Confirm Booking
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowBooking(false)}
                                style={{
                                    padding: "14px",
                                    background: "#ddd",
                                    border: "none",
                                    borderRadius: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>

                        </form>

                    </div>
                )
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
                    "rgba(0,0,0,0.9)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
            }}
        >

            <img
                src={selectedImage}
                alt="preview"
                onClick={(e) =>
                    e.stopPropagation()
                }
                style={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    objectFit: "contain",
                    borderRadius: "10px"
                }}
            />

            <button
                onClick={() =>
                    setSelectedImage(null)
                }
                style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    fontSize: "30px",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer"
                }}
            >
                ✕
            </button>

        </div>
    )
}
        </>

        
    );
};

export default OrganizerDetails;