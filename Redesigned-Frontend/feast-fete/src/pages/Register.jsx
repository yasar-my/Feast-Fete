import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Register = () => {
  const API1 = import.meta.env.VITE_AUTH_URL;

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [loading, setLoading] = useState(false);

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

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 480);
  };

  // password strength (visual feedback only, validation logic unchanged)
  const passwordStrength = (() => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[@$!%*?&.#_-]/.test(p)) score++;
    return score;
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailRegex.test(formData.email)) {
      alert("Email must contain only lowercase letters");
      triggerShake();
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must contain minimum 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
      );
      triggerShake();
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API1}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Registration Failed");

      const result = await response.json();

      console.log("REGISTER RESPONSE =", result);

      const userData = result.data || result;

      const token = userData.accessToken || "";
      const role = userData.role || formData.role;
      const email = userData.email || formData.email;
      const name = userData.name || formData.name;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);
      localStorage.setItem("name", name);

      console.log("TOKEN =", token);
      console.log("ROLE =", role);
      console.log("EMAIL =", email);
      console.log("NAME =", name);

      if (role === "ORGANIZER") {
        navigate("/create-organizer-profile");
      } else {
        navigate("/organizers");
      }
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-root">
      <style>{CSS}</style>

      <div className="rg-page">
        {/* ambient soft blobs */}
        <span className="rg-blob rg-blob-1" />
        <span className="rg-blob rg-blob-2" />

        <div
          className={`rg-card ${
            mounted ? "rg-card-in" : "rg-card-pre"
          } ${shake ? "rg-shake" : ""}`}
        >
          {/* HEADER */}
          <div className="rg-header rg-fade" style={{ "--d": "0.05s" }}>
            <p className="rg-brand">Feast &amp; Fete</p>
            <h1 className="rg-heading">Register</h1>
            <p className="rg-subtext">Create your account</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* NAME */}
            <div className="rg-field rg-fade" style={{ "--d": "0.12s" }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField("")}
                required
                className={`rg-input ${
                  focusedField === "name" ? "rg-input-focus" : ""
                }`}
              />
            </div>

            {/* EMAIL */}
            <div className="rg-field rg-fade" style={{ "--d": "0.18s" }}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value.toLowerCase(),
                  })
                }
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                required
                className={`rg-input ${
                  focusedField === "email" ? "rg-input-focus" : ""
                }`}
              />
            </div>

            {/* PASSWORD */}
            <div className="rg-field rg-fade" style={{ "--d": "0.24s" }}>
              <div className="rg-pass-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  required
                  minLength={8}
                  className={`rg-input rg-pass-input ${
                    focusedField === "password" ? "rg-input-focus" : ""
                  }`}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="rg-eye-toggle"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {formData.password.length > 0 && (
                <div className="rg-strength-row">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`rg-strength-bar ${
                        i < passwordStrength ? `rg-strength-${passwordStrength}` : ""
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ROLE */}
            <div className="rg-field rg-fade" style={{ "--d": "0.3s" }}>
              <div className="rg-role-row">
                {[
                  { value: "CUSTOMER", label: "Customer" },
                  { value: "ORGANIZER", label: "Organizer" },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() =>
                      setFormData({ ...formData, role: opt.value })
                    }
                    className={`rg-role-btn ${
                      formData.role === opt.value ? "rg-role-btn-active" : ""
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="rg-submit rg-fade"
              style={{ "--d": "0.36s" }}
            >
              <span className="rg-submit-shine" />
              <span className="rg-submit-label">
                {loading ? (
                  <span className="rg-loading-row">
                    <span className="rg-spinner" />
                    Creating...
                  </span>
                ) : (
                  "Create Account"
                )}
              </span>
            </button>
          </form>

          {/* LOGIN */}
          <div className="rg-footer rg-fade" style={{ "--d": "0.42s" }}>
            <p>
              Already have an account?{" "}
              <Link to="/login" className="rg-login-link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ CSS -------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600&display=swap');

.rg-root * { box-sizing: border-box; }
.rg-root { font-family: 'Cormorant Garamond', Georgia, serif; }

.rg-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f5f0, #efe5d8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

/* ----- Ambient blobs ----- */
.rg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.35;
  animation: blobFloat 12s ease-in-out infinite;
  pointer-events: none;
}
.rg-blob-1 {
  width: 320px; height: 320px;
  background: #d4af37;
  top: -100px; left: -100px;
}
.rg-blob-2 {
  width: 380px; height: 380px;
  background: #b88949;
  bottom: -120px; right: -100px;
  animation-delay: 2s;
}
@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(30px, -20px) scale(1.08); }
}

/* ----- Card ----- */
.rg-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 540px;
  background: #fff;
  border-radius: 30px;
  padding: 50px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
}
.rg-card-pre { opacity: 0; transform: translateY(24px) scale(0.97); }
.rg-card-in {
  animation: cardIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes cardIn { to { opacity: 1; transform: translateY(0) scale(1); } }

.rg-shake { animation: shakeForm 0.48s ease; }
@keyframes shakeForm {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}

.rg-fade {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

/* ----- Header ----- */
.rg-header { text-align: center; margin-bottom: 38px; }
.rg-brand {
  color: #a47a52;
  letter-spacing: 4px;
  font-size: 13px;
  margin-bottom: 10px;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
}
.rg-heading {
  color: #2b1408;
  font-size: 58px;
  margin-bottom: 8px;
  font-weight: 700;
}
.rg-subtext { color: #7a6556; font-size: 17px; }

/* ----- Inputs ----- */
.rg-field { margin-bottom: 22px; }
.rg-input {
  width: 100%;
  padding: 18px;
  border-radius: 14px;
  border: 1.5px solid #d8c8b6;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  background: #fffdf9;
  transition: border-color 0.22s ease, box-shadow 0.22s ease, transform 0.18s ease;
}
.rg-input-focus {
  border-color: #b88949;
  box-shadow: 0 0 0 4px rgba(184,137,73,0.14);
  transform: translateY(-1px);
}

.rg-pass-wrap { position: relative; }
.rg-pass-input { padding-right: 46px; }
.rg-eye-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 19px;
  color: #8b7040;
  transition: color 0.2s ease, transform 0.2s ease;
}
.rg-eye-toggle:hover {
  color: #b88949;
  transform: translateY(-50%) scale(1.12);
}

/* ----- Password strength ----- */
.rg-strength-row {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  padding: 0 2px;
}
.rg-strength-bar {
  flex: 1;
  height: 4px;
  border-radius: 4px;
  background: #ece1d2;
  transition: background 0.3s ease, transform 0.3s ease;
}
.rg-strength-1 { background: #c0392b; }
.rg-strength-2 { background: #e0902f; }
.rg-strength-3 { background: #d4af37; }
.rg-strength-4 { background: #2e9e5b; }

/* ----- Role toggle ----- */
.rg-role-row {
  display: flex;
  gap: 12px;
  background: #f8f5f0;
  padding: 6px;
  border-radius: 14px;
}
.rg-role-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #7a6556;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}
.rg-role-btn-active {
  background: #2b1408;
  color: #fff;
  box-shadow: 0 6px 16px rgba(43,20,8,0.25);
}
.rg-role-btn:not(.rg-role-btn-active):hover {
  background: #efe5d8;
}

/* ----- Submit ----- */
.rg-submit {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 18px;
  background: #2b1408;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-family: inherit;
  cursor: pointer;
  font-weight: 600;
  margin-top: 4px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease, opacity 0.2s ease;
}
.rg-submit:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(43,20,8,0.3);
  filter: brightness(1.12);
}
.rg-submit:active { transform: scale(0.98); }
.rg-submit:disabled { opacity: 0.7; cursor: not-allowed; }

.rg-submit-label { position: relative; z-index: 1; }
.rg-submit-shine {
  position: absolute;
  top: 0; left: -150%;
  width: 55%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(212,175,55,0.35), transparent);
  animation: shineSweep 3.4s ease-in-out infinite;
}
@keyframes shineSweep {
  0%   { left: -150%; }
  55%  { left: 150%; }
  100% { left: 150%; }
}

.rg-loading-row { display: inline-flex; align-items: center; gap: 10px; }
.rg-spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ----- Footer ----- */
.rg-footer { text-align: center; margin-top: 25px; color: #555; font-size: 16px; }
.rg-login-link {
  color: #2b1408;
  font-weight: bold;
  text-decoration: none;
  position: relative;
}
.rg-login-link::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 1.5px;
  background: #b88949;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}
.rg-login-link:hover::after { transform: scaleX(1); }

/* ----- Reduced motion ----- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

/* ----- Responsive ----- */
@media (max-width: 600px) {
  .rg-card { padding: 34px 26px; border-radius: 24px; }
  .rg-heading { font-size: 44px; }
}
`;

export default Register;
