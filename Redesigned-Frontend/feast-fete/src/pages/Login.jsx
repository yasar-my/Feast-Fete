import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";



const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser(formData);

      console.log("LOGIN RESPONSE =", response.data);

      const userData = response.data.data || response.data;

      const token = userData.accessToken || "";
      const role = userData.role || "";
      const email = userData.email || formData.email;
      const name = userData.name || "";

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);
      localStorage.setItem("name", name);

      console.log("TOKEN =", token);
      console.log("ROLE =", role);
      console.log("EMAIL =", email);
      console.log("NAME =", name);

      if (role === "ORGANIZER") {
        navigate("/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/organizers");
      }
    } catch (error) {
      console.log(error);

      setShake(true);
      setTimeout(() => setShake(false), 500);
      alert("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-root min-h-screen flex">
      <style>{CSS}</style>

      {/* LEFT SIDE */}
      <div className="lg-left hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden">
        {/* ambient gold particles */}
        <div className="lg-particles">
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className="lg-particle"
              style={{
                "--x": `${(i * 37) % 100}%`,
                "--delay": `${(i % 7) * 0.9}s`,
                "--dur": `${10 + (i % 5) * 2}s`,
                "--size": `${2 + (i % 3)}px`,
              }}
            />
          ))}
        </div>

        {/* decorative rings */}
        <div className="lg-ring lg-ring-1" />
        <div className="lg-ring lg-ring-2" />

        {/* content */}
        <div className="lg-left-content relative z-10 text-center px-12">
          <div className="lg-eyebrow lg-fade" style={{ "--d": "0.1s" }}>
            Est. 2020
          </div>

          <h2 className="lg-heading lg-fade" style={{ "--d": "0.25s" }}>
            Crafting
            <br />
            <span className="lg-heading-accent">Unforgettable</span>
            <br />
            Experiences
          </h2>

          <p className="lg-tagline lg-fade" style={{ "--d": "0.4s" }}>
            From weddings to corporate events — we bring elegance
            to every celebration.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg-right w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div
          className={`lg-form-wrap ${
            mounted ? "lg-form-wrap-in" : "lg-form-wrap-pre"
          } ${shake ? "lg-shake" : ""}`}
        >
          {/* HEADER */}
          <div className="text-center mb-12 lg-fade" style={{ "--d": "0.05s" }}>
            <h1 className="lg-brand">Feast &amp; Fete</h1>
            <p className="lg-subtitle">Premium Catering Platform</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="lg-field lg-fade" style={{ "--d": "0.15s" }}>
              <label className="lg-label">Email</label>

              <div
                className={`lg-input-wrap ${
                  focusedField === "email" ? "lg-input-wrap-focus" : ""
                }`}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  required
                  className="lg-input"
                />
                <span className="lg-underline" />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="lg-field lg-field-pass lg-fade" style={{ "--d": "0.25s" }}>
              <label className="lg-label">Password</label>

              <div
                className={`lg-input-wrap ${
                  focusedField === "password" ? "lg-input-wrap-focus" : ""
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  required
                  className="lg-input lg-input-pass"
                />
                <span className="lg-underline" />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="lg-eye-toggle"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="lg-submit lg-fade"
              style={{ "--d": "0.35s" }}
            >
              <span className="lg-submit-shine" />
              <span className="lg-submit-label">
                {loading ? (
                  <span className="lg-loading-row">
                    <span className="lg-spinner" />
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </span>
            </button>
          </form>

          {/* FOOTER */}
          <p className="lg-footer lg-fade" style={{ "--d": "0.45s" }}>
            Crafted with passion for culinary excellence
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ CSS -------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600&display=swap');

.lg-root * { box-sizing: border-box; }
.lg-root { font-family: 'Cormorant Garamond', Georgia, serif; }

/* ----- LEFT PANEL ----- */
.lg-left {
  background: linear-gradient(160deg, #1a0a00 0%, #3d1a00 50%, #6b3010 100%);
  background-size: 200% 200%;
  animation: gradientDrift 14s ease-in-out infinite;
}
@keyframes gradientDrift {
  0%, 100% { background-position: 0% 0%; }
  50%      { background-position: 100% 100%; }
}

.lg-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(212,175,55,0.15);
  animation: ringFloat 9s ease-in-out infinite;
}
.lg-ring-1 { top: -80px; left: -80px; width: 360px; height: 360px; }
.lg-ring-2 {
  bottom: -80px; right: -80px; width: 400px; height: 400px;
  border-color: rgba(212,175,55,0.12);
  animation-delay: 1.5s;
}
@keyframes ringFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
  50%      { transform: translateY(-14px) scale(1.03); opacity: 0.7; }
}

.lg-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.lg-particle {
  position: absolute;
  left: var(--x);
  bottom: -10px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: #d4af37;
  opacity: 0;
  animation: particleRise var(--dur) ease-in var(--delay) infinite;
}
@keyframes particleRise {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  10%  { opacity: 0.55; }
  90%  { opacity: 0.25; }
  100% { transform: translateY(-560px) translateX(18px); opacity: 0; }
}

.lg-left-content { opacity: 1; }

.lg-fade {
  opacity: 0;
  transform: translateY(14px);
  animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}

.lg-eyebrow {
  font-size: 13px;
  letter-spacing: 6px;
  color: #d4af37;
  text-transform: uppercase;
  margin-bottom: 28px;
  font-family: 'Montserrat', sans-serif;
}

.lg-heading {
  font-size: 55px;
  color: #fff8ef;
  line-height: 1.2;
  font-weight: 700;
}
.lg-heading-accent {
  color: #d4af37;
  display: inline-block;
  position: relative;
}
.lg-heading-accent::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: 2px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  transform: scaleX(0);
  transform-origin: center;
  animation: underlineGrow 1s ease 1s forwards;
}
@keyframes underlineGrow { to { transform: scaleX(1); } }

.lg-tagline {
  color: rgba(255,248,239,0.6);
  font-size: 17px;
  line-height: 1.8;
  margin-top: 25px;
  font-style: italic;
}

/* ----- RIGHT PANEL ----- */
.lg-right { background: #fdfaf5; }

.lg-form-wrap {
  width: 100%;
  max-width: 420px;
}
.lg-form-wrap-pre { opacity: 0; transform: translateY(20px); }
.lg-form-wrap-in {
  animation: formWrapIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes formWrapIn {
  to { opacity: 1; transform: translateY(0); }
}

.lg-shake { animation: shakeForm 0.5s ease; }
@keyframes shakeForm {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}

.lg-brand {
  font-size: 45px;
  color: #1a0a00;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}
.lg-subtitle {
  font-size: 12px;
  letter-spacing: 4px;
  color: #8b7040;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
}

.lg-field { margin-bottom: 28px; }
.lg-field-pass { margin-bottom: 40px; }

.lg-label {
  display: block;
  margin-bottom: 10px;
  font-size: 12px;
  color: #8b7040;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
}

.lg-input-wrap { position: relative; }

.lg-input {
  width: 100%;
  padding: 15px;
  border: none;
  border-bottom: 2px solid #c8b070;
  background: transparent;
  outline: none;
  font-size: 17px;
  font-family: inherit;
  color: #1a0a00;
  transition: border-color 0.25s ease;
}
.lg-input-pass { padding-right: 45px; }

.lg-underline {
  position: absolute;
  left: 0; bottom: -2px;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #d4af37, #6b3010);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.lg-input-wrap-focus .lg-underline { transform: scaleX(1); }
.lg-input-wrap-focus .lg-input { border-bottom-color: transparent; }

.lg-eye-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #8b7040;
  font-size: 18px;
  transition: color 0.2s ease, transform 0.2s ease;
}
.lg-eye-toggle:hover {
  color: #d4af37;
  transform: translateY(-50%) scale(1.12);
}

/* ----- Submit button ----- */
.lg-submit {
  position: relative;
  width: 100%;
  padding: 16px;
  background: #1a0a00;
  color: #d4af37;
  border: none;
  font-size: 13px;
  letter-spacing: 4px;
  text-transform: uppercase;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.lg-submit:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(26, 10, 0, 0.35);
  filter: brightness(1.15);
}
.lg-submit:active { transform: scale(0.98); }
.lg-submit:disabled { opacity: 0.75; cursor: not-allowed; }

.lg-submit-label { position: relative; z-index: 1; }

.lg-submit-shine {
  position: absolute;
  top: 0; left: -150%;
  width: 60%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(212,175,55,0.35), transparent);
  animation: shineSweep 3.2s ease-in-out infinite;
}
@keyframes shineSweep {
  0%   { left: -150%; }
  55%  { left: 150%; }
  100% { left: 150%; }
}

.lg-loading-row { display: inline-flex; align-items: center; gap: 10px; }
.lg-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(212,175,55,0.35);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.lg-footer {
  text-align: center;
  margin-top: 35px;
  font-size: 12px;
  color: #b0956a;
  font-style: italic;
}

/* ----- Reduced motion ----- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`;

export default Login;
