import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const OrganizerProfile = () => {
  const API2 = import.meta.env.VITE_PROFILE_URL;

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");

    console.log("EMAIL =", email);

    // EMAIL CHECK
    if (!email || email === "undefined") {
      alert("Login Again");
      navigate("/login");
      return;
    }

    // FETCH PROFILE
    fetch(`${API2}/api/organizer/${email}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Profile Not Found");
        return res.json();
      })
      .then((data) => {
        console.log("PROFILE =", data);
        setProfile(data);
        localStorage.setItem("organizerProfileId", data.id);
      })
      .catch((err) => {
        console.log(err);
        alert("Failed To Load Profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setMounted(true), 30);
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <div className="op-root">
      <style>{CSS}</style>

      {loading && <SkeletonScreen />}

      {!loading && !profile && (
        <div className="op-center">
          <div className="op-state-box op-pop-in">
            <div className="op-state-icon">!</div>
            <h1 className="op-state-title">No Organizer Profile Found</h1>
            <p className="op-state-sub">
              Create your organizer profile to get started.
            </p>
          </div>
        </div>
      )}

      {!loading && profile && (
        <div className="op-page">
          <div className={`op-card ${mounted ? "op-card-in" : "op-card-pre"}`}>
            {/* IMAGE */}
            <div className="op-hero">
              <div className="op-avatar-wrap">
                <span className="op-avatar-glow" />
                <img
                  className="op-avatar"
                  src={
                    profile.profilePhoto ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="profile"
                />
              </div>

              <h1
                className="op-service-name stagger"
                style={{ "--d": "0.1s" }}
              >
                {profile.serviceName}
              </h1>
              <h2 className="op-owner-name stagger" style={{ "--d": "0.18s" }}>
                {profile.name}
              </h2>
            </div>

            {/* DETAILS */}
            <div className="op-details">
              {[
                ["Location", profile.location],
                ["Email", profile.email],
                ["Mobile", profile.mobile],
                ["Food Type", profile.foodType],
                ["Minimum People", profile.minPeople],
                ["Maximum People", profile.maxPeople],
                [
                  "Plate Rate",
                  profile.plateRate != null
                    ? `₹${profile.plateRate}`
                    : null,
                ],
                ["Menu", profile.menu],
              ]
                .filter(([, v]) => v !== null && v !== undefined && v !== "")
                .map(([label, value], i) => (
                  <div
                    key={label}
                    className="op-detail-row stagger"
                    style={{ "--d": `${0.24 + i * 0.05}s` }}
                  >
                    <span className="op-detail-label">{label}</span>
                    <span className="op-detail-value">{value}</span>
                  </div>
                ))}
            </div>

            {/* BUTTON */}
            <button
              onClick={() => navigate("/edit-organizer-profile")}
              className="op-edit-btn stagger"
              style={{ "--d": "0.7s" }}
            >
              <span className="op-edit-shine" />
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------------------- Skeleton ---------------------------- */

const SkeletonScreen = () => (
  <div className="op-center">
    <div className="op-card op-skel-card">
      <div className="op-skel-avatar shimmer" />
      <div className="op-skel-line w60 shimmer" />
      <div className="op-skel-line w40 shimmer" />
      <div className="op-skel-block">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="op-skel-line w90 shimmer" />
        ))}
      </div>
      <div className="op-skel-btn shimmer" />
    </div>
  </div>
);

/* ------------------------------ CSS -------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --ink: #2b1408;
  --ink-soft: #6b5a4d;
  --cream: #FFF8F0;
  --surface: #ffffff;
  --accent: #D97B3F;
  --danger: #C0392B;
  --border: #eee2d4;
  --shadow: 0 20px 50px rgba(43, 20, 8, 0.10);
}

.op-root * { box-sizing: border-box; }
.op-root { font-family: 'Inter', system-ui, sans-serif; color: var(--ink); }

.op-page, .op-center {
  min-height: 100vh;
  background: radial-gradient(circle at 10% 0%, #fff 0%, var(--cream) 55%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

/* ----- Card shell + entrance ----- */
.op-card {
  width: 100%;
  max-width: 850px;
  background: var(--surface);
  border-radius: 26px;
  padding: 44px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}
.op-card-pre { opacity: 0; transform: translateY(18px); }
.op-card-in {
  animation: cardRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes cardRise {
  from { opacity: 0; transform: translateY(18px) scale(0.985); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.stagger {
  opacity: 0;
  transform: translateY(10px);
  animation: staggerIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes staggerIn { to { opacity: 1; transform: translateY(0); } }

/* ----- Hero / avatar ----- */
.op-hero { text-align: center; }

.op-avatar-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
}
.op-avatar-glow {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217,123,63,0.35) 0%, rgba(217,123,63,0) 70%);
  animation: glowPulse 3.2s ease-in-out infinite;
}
@keyframes glowPulse {
  0%, 100% { transform: scale(0.94); opacity: 0.7; }
  50%      { transform: scale(1.08); opacity: 1; }
}
.op-avatar {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid var(--ink);
  display: block;
  animation: avatarPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s both;
}
@keyframes avatarPop {
  from { opacity: 0; transform: scale(0.75); }
  to   { opacity: 1; transform: scale(1); }
}

.op-service-name {
  margin-top: 22px;
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(34px, 5vw, 50px);
  color: var(--ink);
  letter-spacing: -0.01em;
}
.op-owner-name {
  margin-top: 6px;
  color: var(--ink-soft);
  font-size: 18px;
  font-weight: 500;
}

/* ----- Details ----- */
.op-details {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
}
.op-detail-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 4px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s ease, padding-left 0.2s ease;
}
.op-detail-row:hover {
  background: var(--cream);
  padding-left: 12px;
  border-radius: 8px;
}
.op-detail-row:last-child { border-bottom: none; }
.op-detail-label {
  font-weight: 600;
  color: var(--ink-soft);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}
.op-detail-value {
  font-size: 17px;
  font-weight: 500;
  text-align: right;
}

/* ----- Edit button ----- */
.op-edit-btn {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 18px;
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 18px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  margin-top: 32px;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.op-edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(43, 20, 8, 0.3);
  filter: brightness(1.08);
}
.op-edit-btn:active { transform: scale(0.98); }
.op-edit-shine {
  position: absolute;
  top: 0; left: -150%;
  width: 50%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.22), transparent);
  animation: shineSweep 3.2s ease-in-out infinite;
}
@keyframes shineSweep {
  0%   { left: -150%; }
  60%  { left: 150%; }
  100% { left: 150%; }
}

/* ----- Skeleton ----- */
.op-skel-card { display: flex; flex-direction: column; align-items: center; }
.op-skel-avatar { width: 180px; height: 180px; border-radius: 50%; margin-bottom: 22px; }
.op-skel-line { height: 16px; border-radius: 8px; margin-top: 12px; }
.op-skel-block { width: 100%; margin-top: 24px; }
.w60 { width: 60%; }
.w40 { width: 40%; }
.w90 { width: 100%; height: 20px; margin-top: 18px; }
.op-skel-btn { width: 100%; height: 56px; border-radius: 14px; margin-top: 32px; }

.shimmer {
  background: linear-gradient(90deg, #f1e9dd 25%, #faf4ec 37%, #f1e9dd 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* ----- Empty / state box ----- */
.op-state-box {
  text-align: center;
  background: var(--surface);
  padding: 56px 48px;
  border-radius: 24px;
  box-shadow: var(--shadow);
  max-width: 420px;
  border: 1px solid var(--border);
}
.op-pop-in { animation: cardRise 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.op-state-icon {
  width: 56px; height: 56px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #faf1e2;
  color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px;
  font-weight: 700;
  animation: glowPulse 2.6s ease-in-out infinite;
}
.op-state-title {
  font-family: 'Fraunces', serif;
  font-size: 24px;
  color: var(--ink);
}
.op-state-sub { color: var(--ink-soft); margin-top: 10px; font-size: 15px; }

/* ----- Reduced motion ----- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

/* ----- Responsive ----- */
@media (max-width: 640px) {
  .op-card, .op-state-box { padding: 28px 22px; border-radius: 20px; }
  .op-detail-row { flex-direction: column; gap: 4px; }
  .op-detail-value { text-align: left; }
}
`;

export default OrganizerProfile;
