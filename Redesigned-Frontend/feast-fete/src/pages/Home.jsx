import { Link } from "react-router-dom";

import WeddingImg from "../assets/Wedding.jpg";
import BirthdayImg from "../assets/Birthday.jpg";
import BuffetImg from "../assets/Buffet.jpg";
import CorporateImg from "../assets/Corporate.jpg";
import OutdoorImg from "../assets/Outdoor.jpg";
import PrivateImg from "../assets/Private.jpg";

const Home = () => {

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #f8f5f0 0%, #f1e8dc 100%)",
                fontFamily: "'Cormorant Garamond', serif",
            }}
        >

            {/* HERO SECTION */}

            <section
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                }}
            >

                <div
                    style={{
                        width: "100%",
                        maxWidth: "1300px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
                        gap: "60px",
                        alignItems: "center",
                    }}
                >

                    {/* LEFT CONTENT */}

                    <div>

                        <p
                            style={{
                                color: "#8b5e3c",
                                letterSpacing: "4px",
                                fontSize: "14px",
                                fontWeight: "600",
                                marginBottom: "20px",
                                textTransform: "uppercase",
                            }}
                        >
                            Premium Catering Experience
                        </p>

                        <h1
                            style={{
                                fontSize: "clamp(3rem, 7vw, 6rem)",
                                lineHeight: "1.1",
                                color: "#2b1408",
                                marginBottom: "25px",
                                fontWeight: "700",
                            }}
                        >
                            Crafting
                            <span style={{ color: "#b8860b" }}>
                                {" "}
                                unforgettable{" "}
                            </span>
                            dining moments
                        </h1>

                        <p
                            style={{
                                fontSize: "20px",
                                lineHeight: "1.8",
                                color: "#5e4636",
                                marginBottom: "35px",
                                maxWidth: "600px",
                            }}
                        >
                            Feast & Fete delivers luxury catering services
                            for weddings, corporate events, private parties,
                            and grand celebrations with elegance and taste.
                        </p>

                        {/* BUTTONS */}

                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "20px",
                            }}
                        >

                            <Link
                                to="/register"
                                style={{
                                    padding: "16px 36px",
                                    background: "#2b1408",
                                    color: "#fff",
                                    textDecoration: "none",
                                    borderRadius: "50px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    letterSpacing: "1px",
                                    transition: "0.3s",
                                }}
                            >
                                Get Started
                            </Link>

                            <Link
                                to="/login"
                                style={{
                                    padding: "16px 36px",
                                    border: "2px solid #2b1408",
                                    color: "#2b1408",
                                    textDecoration: "none",
                                    borderRadius: "50px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    letterSpacing: "1px",
                                    background: "transparent",
                                }}
                            >
                                Explore Services
                            </Link>

                        </div>

                        {/* STATS */}

                        <div
                            style={{
                                display: "flex",
                                gap: "40px",
                                marginTop: "60px",
                                flexWrap: "wrap",
                            }}
                        >

                            <div>
                                <h2
                                    style={{
                                        color: "#2b1408",
                                        fontSize: "40px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    500+
                                </h2>

                                <p style={{ color: "#6e5849" }}>
                                    Events Hosted
                                </p>
                            </div>

                            <div>
                                <h2
                                    style={{
                                        color: "#2b1408",
                                        fontSize: "40px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    50+
                                </h2>

                                <p style={{ color: "#6e5849" }}>
                                    Premium Chefs
                                </p>
                            </div>

                            <div>
                                <h2
                                    style={{
                                        color: "#2b1408",
                                        fontSize: "40px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    4.9★
                                </h2>

                                <p style={{ color: "#6e5849" }}>
                                    Customer Rating
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT IMAGE SECTION */}

                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >

                        <div
                            style={{
                                width: "100%",
                                maxWidth: "500px",
                                height: "650px",
                                borderRadius: "30px",
                                overflow: "hidden",
                                boxShadow:
                                    "0 20px 60px rgba(0,0,0,0.2)",
                                position: "relative",
                            }}
                        >

                            <img
                                src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop"
                                alt="Catering"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />

                            <div
                                style={{
                                    position: "absolute",
                                    inset: "0",
                                    background:
                                        "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                                }}
                            />

                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "30px",
                                    left: "30px",
                                    color: "#fff",
                                }}
                            >

                                <h2
                                    style={{
                                        fontSize: "36px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    Luxury Catering
                                </h2>

                                <p
                                    style={{
                                        fontSize: "18px",
                                        opacity: "0.9",
                                    }}
                                >
                                    Elegant • Premium • Memorable
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>
            
            {/* SERVICES SECTION */}

            <section
            style={{
                padding: "100px 20px",
                background: "#fff",
            }}
            >
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "clamp(2.5rem,5vw,4.5rem)",
                    color: "#2b1408",
                    marginBottom: "15px",
                }}
                >
                Our Premium Services
                </h2>

                <p
                style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "20px",
                    maxWidth: "700px",
                    margin: "0 auto 70px",
                }}
                >
                We provide luxury catering solutions for weddings,
                corporate events, birthday celebrations and private gatherings.
                </p>

            <div
                style={{
                maxWidth: "1200px",
                margin: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
                gap: "30px",
                }}
            >
                {[
                    {
                        title: "Wedding Catering",
                        img: {WeddingImg},
                    },
                    {
                        title: "Corporate Events",
                        img:{CorporateImg},
                    },
                    {
                        title: "Private Parties",
                        img: {PrivateImg},
                    },
                    {
                        title: "Birthday Events",
                        img: {BirthdayImg},
                    },
                    {
                        title: "Outdoor Catering",
                        img: {OutdoorImg},
                    },
                    {
                        title: "Buffet Services",
                        img: {BuffetImg},
                    }
                    ].map((service, index) => (
                <div
                    key={index}
                    style={{
                    background: "#fff",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    transition: "0.3s ease",
                    cursor: "pointer",
                    }}
                >
                    <img
                    src={service.img}
                    alt={service.title}
                    style={{
                        width: "100%",
                        height: "clamp(220px,30vw,280px)",
                        objectFit: "cover",
                    }}
                    />

                    <div style={{ padding: "20px" }}>
                    <h3>{service.title}</h3>
                    <p style={{ color: "#666" }}>
                        Premium catering tailored for memorable experiences.
                    </p>
                    </div>
                </div>
                ))}
            </div>
            </section>

            {/* WHY CHOOSE US */}

            <section
            style={{
                padding: "100px 20px",
                background: "#2b1408",
                color: "#fff",
            }}
            >
            <h2
                style={{
                textAlign: "center",
                fontSize: "50px",
                marginBottom: "60px",
                }}
            >
                Why Choose Feast & Fete
            </h2>

            <div
                style={{
                maxWidth: "1200px",
                margin: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                gap: "30px",
                }}
            >
                <div
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "30px",
                        borderRadius: "20px",
                        textAlign: "center",
                    }}
                    >
                    <h3 style={{ fontSize: "28px" }}>⭐ 500+</h3>
                    <p>Events Successfully Hosted</p>
                    </div>

                <div
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "30px",
                        borderRadius: "20px",
                        textAlign: "center",
                    }}>
                <h3>👨‍🍳 Expert Chefs</h3>
                <p>Professional culinary team.</p>
                </div>

                <div
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "30px",
                        borderRadius: "20px",
                        textAlign: "center",
                    }}>
                <h3>🍽 Premium Menus</h3>
                <p>Customized dishes for every occasion.</p>
                </div>

                <div
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "30px",
                        borderRadius: "20px",
                        textAlign: "center",
                    }}>
                <h3>🏆 Top Rated</h3>
                <p>Trusted by hundreds of happy clients.</p>
                </div>
            </div>
            </section>

            {/* TESTIMONIALS */}

            <section
            style={{
                padding: "100px 20px",
                background: "#f8f5f0",
            }}
            >
            <h2
                style={{
                textAlign: "center",
                fontSize: "50px",
                color: "#2b1408",
                marginBottom: "50px",
                }}
            >
                What Our Clients Say
            </h2>

            <div
                style={{
                maxWidth: "1200px",
                margin: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
                gap: "30px",
                }}
            >
                <div
                style={{
                    background: "#fff",
                    padding: "clamp(20px,4vw,35px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    borderRadius: "20px",
                }}
                >
                <h3>★★★★★</h3>
                <p>
                    Amazing catering service. Food quality and presentation were
                    outstanding.
                </p>
                <strong>- Sarah</strong>
                </div>

                <div
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "20px",
                }}
                >
                <h3>★★★★★</h3>
                <p>
                    Perfect arrangement for our corporate event. Highly recommended.
                </p>
                <strong>- David</strong>
                </div>
            </div>
            </section>

            {/* CTA SECTION */}

            <section
            style={{
                padding: "120px 20px",
                background: "linear-gradient(135deg,#2b1408,#5a2f12)",
                textAlign: "center",
                color: "#fff",
            }}
            >
            <h2
                style={{
                fontSize: "clamp(2rem,6vw,4rem)",
                marginBottom: "20px",
                }}
            >
                Ready To Host Your Next Event?
            </h2>

            <p
                style={{
                fontSize: "clamp(1rem,2vw,1.4rem)",
                marginBottom: "40px",
                }}
            >
                Let's create an unforgettable dining experience together.
            </p>

            <Link
                to="/register"
                style={{
                padding: "18px 40px",
                background: "#b8860b",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "50px",
                fontWeight: "600",
                }}
            >
                Book Now
            </Link>
            </section>

        </div>
    );
};

export default Home;