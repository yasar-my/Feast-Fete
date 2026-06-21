import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const useReveal = (options = {}) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(node);
                }
            },
            { threshold: 0.15, ...options }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return [ref, visible];
};

const Reveal = ({ children, delay = 0, style = {} }) => {
    const [ref, visible] = useReveal();
    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(36px)",
                transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
                ...style,
            }}
        >
            {children}
        </div>
    );
};

const Counter = ({ value, suffix = "", duration = 1600 }) => {
    const [ref, visible] = useReveal({ threshold: 0.6 });
    const [count, setCount] = useState(0);
    const isDecimal = value % 1 !== 0;

    useEffect(() => {
        if (!visible) return;
        let start = null;
        let frame;

        const step = (timestamp) => {
            if (start === null) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = value * eased;
            setCount(isDecimal ? +current.toFixed(1) : Math.floor(current));
            if (progress < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [visible]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
};

const services = [
    {
        title: "Wedding Catering",
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
    },
    {
        title: "Corporate Events",
        img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
    },
    {
        title: "Private Parties",
        img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200",
    },
    {
        title: "Birthday Events",
        img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200",
    },
    {
        title: "Outdoor Catering",
        img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200",
    },
    {
        title: "Buffet Services",
        img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200",
    },
];

const Home = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const heroStagger = (delay) => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    });

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #f8f5f0 0%, #f1e8dc 100%)",
                fontFamily: "'Cormorant Garamond', serif",
                overflowX: "hidden",
            }}
        >
            {/* GLOBAL ANIMATION STYLES */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-16px); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(184,134,11,0.45); }
                    50% { box-shadow: 0 0 0 14px rgba(184,134,11,0); }
                }

                .shimmer-text {
                    background: linear-gradient(90deg, #b8860b 0%, #f3d98a 25%, #b8860b 50%, #f3d98a 75%, #b8860b 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 5s linear infinite;
                }

                .hero-image-float { animation: float 6s ease-in-out infinite; }

                .btn-primary:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 14px 30px rgba(43,20,8,0.35);
                }
                .btn-secondary:hover {
                    transform: translateY(-4px);
                    background: #2b1408 !important;
                    color: #fff !important;
                }

                .service-card { transition: transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease; }
                .service-card:hover {
                    transform: translateY(-12px);
                    box-shadow: 0 28px 48px rgba(0,0,0,0.18);
                }
                .service-card .service-img { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
                .service-card:hover .service-img { transform: scale(1.12); }

                .why-card { transition: transform 0.4s ease, background 0.4s ease; }
                .why-card:hover {
                    transform: translateY(-8px);
                    background: rgba(255,255,255,0.16) !important;
                }

                .testimonial-card { transition: transform 0.4s ease, box-shadow 0.4s ease; }
                .testimonial-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 38px rgba(0,0,0,0.14);
                }

                .cta-button {
                    animation: pulseGlow 2.4s ease-in-out infinite;
                }
                .cta-button:hover {
                    transform: translateY(-5px) scale(1.05);
                }

                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.001ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.001ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>

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
                                ...heroStagger(0),
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
                                ...heroStagger(0.15),
                            }}
                        >
                            Crafting
                            <span className="shimmer-text"> unforgettable </span>
                            dining moments
                        </h1>

                        <p
                            style={{
                                fontSize: "20px",
                                lineHeight: "1.8",
                                color: "#5e4636",
                                marginBottom: "35px",
                                maxWidth: "600px",
                                ...heroStagger(0.3),
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
                                ...heroStagger(0.45),
                            }}
                        >
                            <Link
                                to="/register"
                                className="btn-primary"
                                style={{
                                    padding: "16px 36px",
                                    background: "#2b1408",
                                    color: "#fff",
                                    textDecoration: "none",
                                    borderRadius: "50px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    letterSpacing: "1px",
                                    transition: "0.3s ease",
                                    display: "inline-block",
                                }}
                            >
                                Get Started
                            </Link>

                            <Link
                                to="/login"
                                className="btn-secondary"
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
                                    transition: "0.3s ease",
                                    display: "inline-block",
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
                                ...heroStagger(0.6),
                            }}
                        >
                            <div>
                                <h2 style={{ color: "#2b1408", fontSize: "40px", marginBottom: "5px" }}>
                                    <Counter value={500} suffix="+" />
                                </h2>
                                <p style={{ color: "#6e5849" }}>Events Hosted</p>
                            </div>

                            <div>
                                <h2 style={{ color: "#2b1408", fontSize: "40px", marginBottom: "5px" }}>
                                    <Counter value={50} suffix="+" />
                                </h2>
                                <p style={{ color: "#6e5849" }}>Premium Chefs</p>
                            </div>

                            <div>
                                <h2 style={{ color: "#2b1408", fontSize: "40px", marginBottom: "5px" }}>
                                    <Counter value={4.9} suffix="★" />
                                </h2>
                                <p style={{ color: "#6e5849" }}>Customer Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT IMAGE SECTION */}
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "scale(1)" : "scale(0.92)",
                            transition: "opacity 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s",
                        }}
                    >
                        <div className="hero-image-float" style={{ width: "100%", maxWidth: "500px" }}>
                            <div
                                style={{
                                    width: "100%",
                                    height: "650px",
                                    borderRadius: "30px",
                                    overflow: "hidden",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                                    position: "relative",
                                }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop"
                                    alt="Catering"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />

                                <div
                                    style={{
                                        position: "absolute",
                                        inset: "0",
                                        background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                                    }}
                                />

                                <div style={{ position: "absolute", bottom: "30px", left: "30px", color: "#fff" }}>
                                    <h2 style={{ fontSize: "36px", marginBottom: "10px" }}>Luxury Catering</h2>
                                    <p style={{ fontSize: "18px", opacity: "0.9" }}>
                                        Elegant • Premium • Memorable
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section style={{ padding: "100px 20px", background: "#fff" }}>
                <Reveal>
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
                </Reveal>

                <Reveal delay={0.1}>
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
                </Reveal>

                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
                        gap: "30px",
                    }}
                >
                    {services.map((service, index) => (
                        <Reveal key={service.title} delay={(index % 3) * 0.12}>
                            <div
                                className="service-card"
                                style={{
                                    background: "#fff",
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                    cursor: "pointer",
                                }}
                            >
                                <img
                                    src={service.img}
                                    alt={service.title}
                                    className="service-img"
                                    style={{
                                        width: "100%",
                                        height: "clamp(220px,30vw,280px)",
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />

                                <div style={{ padding: "20px" }}>
                                    <h3>{service.title}</h3>
                                    <p style={{ color: "#666" }}>
                                        Premium catering tailored for memorable experiences.
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section style={{ padding: "100px 20px", background: "#2b1408", color: "#fff" }}>
                <Reveal>
                    <h2 style={{ textAlign: "center", fontSize: "50px", marginBottom: "60px" }}>
                        Why Choose Feast & Fete
                    </h2>
                </Reveal>

                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                        gap: "30px",
                    }}
                >
                    {[
                        { icon: "⭐", title: <><Counter value={500} suffix="+" /></>, text: "Events Successfully Hosted" },
                        { icon: "👨‍🍳", title: "Expert Chefs", text: "Professional culinary team." },
                        { icon: "🍽", title: "Premium Menus", text: "Customized dishes for every occasion." },
                        { icon: "🏆", title: "Top Rated", text: "Trusted by hundreds of happy clients." },
                    ].map((item, index) => (
                        <Reveal key={index} delay={index * 0.12}>
                            <div
                                className="why-card"
                                style={{
                                    background: "rgba(255,255,255,0.08)",
                                    padding: "30px",
                                    borderRadius: "20px",
                                    textAlign: "center",
                                    height: "100%",
                                }}
                            >
                                <h3 style={{ fontSize: "28px" }}>
                                    {item.icon} {item.title}
                                </h3>
                                <p>{item.text}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={{ padding: "100px 20px", background: "#f8f5f0" }}>
                <Reveal>
                    <h2 style={{ textAlign: "center", fontSize: "50px", color: "#2b1408", marginBottom: "50px" }}>
                        What Our Clients Say
                    </h2>
                </Reveal>

                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
                        gap: "30px",
                    }}
                >
                    <Reveal delay={0}>
                        <div
                            className="testimonial-card"
                            style={{
                                background: "#fff",
                                padding: "clamp(20px,4vw,35px)",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                                borderRadius: "20px",
                                height: "100%",
                            }}
                        >
                            <h3>★★★★★</h3>
                            <p>
                                Amazing catering service. Food quality and presentation were
                                outstanding.
                            </p>
                            <strong>- Sarah</strong>
                        </div>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <div
                            className="testimonial-card"
                            style={{
                                background: "#fff",
                                padding: "30px",
                                borderRadius: "20px",
                                height: "100%",
                            }}
                        >
                            <h3>★★★★★</h3>
                            <p>Perfect arrangement for our corporate event. Highly recommended.</p>
                            <strong>- David</strong>
                        </div>
                    </Reveal>
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
                <Reveal>
                    <h2 style={{ fontSize: "clamp(2rem,6vw,4rem)", marginBottom: "20px" }}>
                        Ready To Host Your Next Event?
                    </h2>
                </Reveal>

                <Reveal delay={0.12}>
                    <p style={{ fontSize: "clamp(1rem,2vw,1.4rem)", marginBottom: "40px" }}>
                        Let's create an unforgettable dining experience together.
                    </p>
                </Reveal>

                <Reveal delay={0.24}>
                    <Link
                        to="/register"
                        className="cta-button"
                        style={{
                            padding: "18px 40px",
                            background: "#b8860b",
                            color: "#fff",
                            textDecoration: "none",
                            borderRadius: "50px",
                            fontWeight: "600",
                            display: "inline-block",
                            transition: "transform 0.3s ease",
                        }}
                    >
                        Book Now
                    </Link>
                </Reveal>
            </section>
        </div>
    );
};

export default Home;
