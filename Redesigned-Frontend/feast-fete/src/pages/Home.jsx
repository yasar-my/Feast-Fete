import { Link } from "react-router-dom";

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

            <section
                style={{
                padding:"100px 20px",
                background:"#fff"
                }}
                >
                <div
                style={{
                maxWidth:"1200px",
                margin:"auto",
                display:"grid",
                gridTemplateColumns:"repeat(auto-fit,minmax(350px,1fr))",
                gap:"50px",
                alignItems:"center"
                }}
                >

                <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
                alt=""
                style={{
                width:"100%",
                borderRadius:"20px"
                }}
                />

                <div>
                <h2
                style={{
                fontSize:"clamp(2rem,5vw,4rem)",
                color:"#2b1408"
                }}
                >
                About Feast & Fete
                </h2>

                <p
                style={{
                fontSize:"18px",
                lineHeight:"1.8",
                color:"#666"
                }}
                >
                We specialize in luxury catering services for weddings,
                corporate gatherings, birthdays and exclusive celebrations.
                Our passion is creating unforgettable dining experiences.
                </p>
                </div>

                </div>
            </section>

            <section
                style={{
                padding:"100px 20px",
                background:"#f8f5f0"
                }}
                >

                <h2
                style={{
                textAlign:"center",
                fontSize:"50px",
                marginBottom:"60px"
                }}
                >
                How We Work
                </h2>

                <div
                style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
                gap:"30px",
                maxWidth:"1200px",
                margin:"auto"
                }}
                >

                <div>
                <h3>1️⃣ Consultation</h3>
                <p>Discuss event requirements.</p>
                </div>

                <div>
                <h3>2️⃣ Menu Planning</h3>
                <p>Create custom menu.</p>
                </div>

                <div>
                <h3>3️⃣ Event Execution</h3>
                <p>Professional catering service.</p>
                </div>

                <div>
                <h3>4️⃣ Guest Satisfaction</h3>
                <p>Memorable dining experience.</p>
                </div>

                </div>

                </section>
                <section
                style={{
                padding:"100px 20px",
                background:"#fff"
                }}
                >

                <h2
                style={{
                textAlign:"center",
                fontSize:"50px",
                marginBottom:"60px"
                }}
                >
                Our Menu
                </h2>

                <div
                style={{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
                gap:"30px"
                }}
                >

                <div>🥗 Veg Menu</div>
                <div>🍗 Non-Veg Menu</div>
                <div>🍰 Desserts</div>
                <div>🥤 Beverages</div>

                </div>

                </section>
                <section
                style={{
                padding:"100px 20px",
                background:"#f8f5f0"
                }}
                >

                <h2
                style={{
                textAlign:"center",
                fontSize:"50px",
                marginBottom:"50px"
                }}
                >
                Frequently Asked Questions
                </h2>

                <div
                style={{
                maxWidth:"900px",
                margin:"auto"
                }}
                >

                <details>
                <summary>Do you provide wedding catering?</summary>
                <p>Yes, we specialize in luxury wedding catering.</p>
                </details>

                <details>
                <summary>Can menus be customized?</summary>
                <p>Yes, all menus can be customized.</p>
                </details>

                <details>
                <summary>Do you serve corporate events?</summary>
                <p>Yes, we cater all corporate functions.</p>
                </details>

                </div>

                </section>
                <footer
                style={{
                background:"#2b1408",
                color:"#fff",
                padding:"60px 20px",
                textAlign:"center"
                }}
                >

                <h2>Feast & Fete</h2>

                <p>
                Luxury Catering Services For Every Occasion
                </p>

                <p style={{marginTop:"20px"}}>
                © 2026 Feast & Fete. All Rights Reserved.
                </p>

                </footer>


            

        </div>
    );
};

export default Home;