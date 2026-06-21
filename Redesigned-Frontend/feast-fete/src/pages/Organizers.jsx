import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChefHat, MapPin, UtensilsCrossed, Users } from "lucide-react";



const Organizers = () => {
  const API2 = import.meta.env.VITE_PROFILE_URL;

  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch(`${API2}/api/organizer/all`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch organizers");
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

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setMounted(true), 30);
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <div className="og-root">
      <style>{CSS}</style>

      {loading && <SkeletonScreen />}

      {!loading && error && (
        <div className="og-center">
          <div className="og-state-box og-pop-in">
            <div className="og-state-icon og-state-icon-error">!</div>
            <h1 className="og-state-title og-state-title-error">{error}</h1>
            <p className="og-state-sub">Please check backend server</p>
          </div>
        </div>
      )}

      {!loading && !error && organizers.length === 0 && (
        <div className="og-center">
          <div className="og-state-box og-pop-in">
            <div className="og-state-icon">
              <ChefHat size={28} />
            </div>
            <h1 className="og-state-title">No Organizers Found</h1>
            <p className="og-state-sub">
              Check back soon — new caterers join regularly.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && organizers.length > 0 && (
        <div className="og-page">
          {/* TITLE */}
          <div className="og-title-row">
            <p className="og-eyebrow og-fade" style={{ "--d": "0.05s" }}>
              Premium Catering Partners
            </p>
            <h1 className="og-title og-fade" style={{ "--d": "0.12s" }}>
              Explore Organizers
            </h1>
          </div>

          {/* CARDS */}
          <div className="og-grid">
            {organizers.map((organizer, i) => (
              <OrganizerCard
                key={organizer.id}
                organizer={organizer}
                index={i}
                mounted={mounted}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ----------------------------- Card -------------------------------- */

const OrganizerCard = ({ organizer, index, mounted }) => (
  <div
    className={`og-card ${mounted ? "og-card-in" : "og-card-pre"}`}
    style={{ "--d": `${0.18 + Math.min(index, 8) * 0.07}s` }}
  >
    {/* IMAGE */}
    <div className="og-photo-row">
      <div className="og-photo-wrap">
        <img
          src={
            organizer.profilePhoto ||
            "https://images.unsplash.com/photo-1555244162-803834f70033"
          }
          alt={organizer.name}
          className="og-photo"
        />
      </div>
    </div>

    {/* CONTENT */}
    <div className="og-card-content">
      <h2 className="og-service-name">{organizer.serviceName}</h2>

      <p className="og-meta-row">
        <ChefHat size={16} className="og-meta-icon" />
        {organizer.name}
      </p>
      <p className="og-meta-row">
        <MapPin size={16} className="og-meta-icon" />
        {organizer.location}
      </p>
      <p className="og-meta-row">
        <UtensilsCrossed size={16} className="og-meta-icon" />
        {organizer.foodType}
      </p>
      <p className="og-meta-row">
        <Users size={16} className="og-meta-icon" />
        {organizer.minPeople} - {organizer.maxPeople} People
      </p>

      <p className="og-rate">
        ₹ {organizer.plateRate} <span>/ Plate</span>
      </p>

      {/* MENU */}
      <div className="og-menu-box">
        <h3 className="og-menu-title">Menu</h3>
        <p className="og-menu-text">{organizer.menu}</p>
      </div>

      {/* BUTTON */}
      <Link
        to={`/organizer/${encodeURIComponent(organizer.email)}`}
        className="og-link"
      >
        <button className="og-view-btn">
          <span className="og-view-shine" />
          View Details
        </button>
      </Link>
    </div>
  </div>
);

/* ---------------------------- Skeleton ---------------------------- */

const SkeletonScreen = () => (
  <div className="og-page">
    <div className="og-title-row" style={{ alignItems: "center" }}>
      <div className="og-skel-eyebrow shimmer" />
      <div className="og-skel-title shimmer" />
    </div>

    <div className="og-grid">
      {[...Array(6)].map((_, i) => (
        <div className="og-card og-skel-card" key={i}>
          <div className="og-skel-photo shimmer" />
          <div className="og-card-content">
            <div className="og-skel-line w70 shimmer" />
            {[...Array(4)].map((_, j) => (
              <div className="og-skel-line w50 shimmer" key={j} />
            ))}
            <div className="og-skel-menu shimmer" />
            <div className="og-skel-btn shimmer" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ------------------------------ CSS -------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --ink: #2b1408;
  --ink-soft: #6b5a4d;
  --cream: #f8f5f0;
  --surface: #ffffff;
  --accent: #b88949;
  --accent-soft: #faf1e2;
  --danger: #C0392B;
  --border: #ece3d4;
  --shadow: 0 10px 30px rgba(0,0,0,0.08);
  --shadow-hover: 0 24px 50px rgba(43,20,8,0.16);
}

.og-root * { box-sizing: border-box; }
.og-root { font-family: 'Inter', system-ui, sans-serif; color: var(--ink); }

.og-page { min-height: 100vh; background: var(--cream); padding: 60px 5%; }
.og-center {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--cream);
  padding: 40px;
}

.og-fade {
  opacity: 0;
  transform: translateY(14px);
  animation: fadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

/* ----- Title ----- */
.og-title-row { text-align: center; margin-bottom: 60px; }
.og-eyebrow {
  letter-spacing: 4px;
  color: var(--accent);
  font-size: 13px;
  text-transform: uppercase;
  font-weight: 600;
}
.og-title {
  font-size: clamp(40px, 7vw, 64px);
  color: var(--ink);
  font-family: 'Fraunces', serif;
  font-weight: 700;
  margin-top: 10px;
  letter-spacing: -0.01em;
}

/* ----- Grid + Card ----- */
.og-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 35px;
}

.og-card {
  background: var(--surface);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
  display: flex;
  flex-direction: column;
}
.og-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
}
.og-card-pre { opacity: 0; transform: translateY(28px) scale(0.97); }
.og-card-in {
  animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes cardIn { to { opacity: 1; transform: translateY(0) scale(1); } }

.og-photo-row { display: flex; justify-content: center; padding: 25px; position: relative; }
.og-photo-wrap {
  width: 170px; height: 170px;
  border-radius: 50%;
  overflow: hidden;
}
.og-photo {
  width: 100%; height: 100%;
  object-fit: cover;
  border: 5px solid var(--ink);
  border-radius: 50%;
  display: block;
  transition: transform 0.5s ease;
}
.og-card:hover .og-photo { transform: scale(1.08); }

.og-card-content { padding: 0 30px 30px; display: flex; flex-direction: column; flex: 1; }

.og-service-name {
  color: var(--ink);
  margin-bottom: 12px;
  font-size: 28px;
  font-family: 'Fraunces', serif;
  font-weight: 600;
}

.og-meta-row {
  color: #666;
  margin-bottom: 9px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 15px;
}
.og-meta-icon { color: var(--accent); flex-shrink: 0; }

.og-rate {
  color: var(--accent);
  margin: 8px 0 20px;
  font-weight: 700;
  font-size: 20px;
}
.og-rate span { font-size: 14px; font-weight: 500; color: var(--ink-soft); }

.og-menu-box {
  background: var(--cream);
  padding: 18px;
  border-radius: 14px;
  margin-bottom: 25px;
}
.og-menu-title { margin-bottom: 10px; color: var(--ink); font-size: 16px; font-weight: 600; }
.og-menu-text {
  color: #555;
  line-height: 1.8;
  font-size: 14.5px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.og-link { text-decoration: none; margin-top: auto; }

.og-view-btn {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 15px;
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 1px;
  font-family: inherit;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.og-view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(43,20,8,0.28);
  filter: brightness(1.1);
}
.og-view-btn:active { transform: scale(0.97); }
.og-view-shine {
  position: absolute;
  top: 0; left: -150%;
  width: 50%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: none;
}
.og-card:hover .og-view-shine {
  animation: shineSweep 0.9s ease;
}
@keyframes shineSweep {
  0%   { left: -150%; }
  100% { left: 150%; }
}

/* ----- Skeleton ----- */
.og-skel-eyebrow { width: 220px; height: 14px; border-radius: 6px; margin: 0 auto; }
.og-skel-title { width: 360px; max-width: 80vw; height: 56px; border-radius: 10px; margin: 14px auto 0; }
.og-skel-card { display: flex; flex-direction: column; }
.og-skel-photo { width: 170px; height: 170px; border-radius: 50%; margin: 25px auto; }
.og-skel-line { height: 16px; border-radius: 8px; margin-bottom: 12px; }
.w70 { width: 70%; height: 22px; }
.w50 { width: 50%; }
.og-skel-menu { height: 70px; border-radius: 14px; margin: 10px 0 20px; }
.og-skel-btn { height: 48px; border-radius: 12px; margin-top: auto; }

.shimmer {
  background: linear-gradient(90deg, #ece3d4 25%, #f6f0e6 37%, #ece3d4 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* ----- States ----- */
.og-state-box {
  text-align: center;
  background: var(--surface);
  padding: 56px 48px;
  border-radius: 24px;
  box-shadow: var(--shadow);
  max-width: 420px;
  border: 1px solid var(--border);
}
.og-pop-in { animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.og-state-icon {
  width: 60px; height: 60px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 26px;
  font-weight: 700;
  animation: glowPulse 2.6s ease-in-out infinite;
}
.og-state-icon-error {
  background: #fdecea;
  color: var(--danger);
  animation: shake 0.5s ease 0.3s;
}
@keyframes glowPulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.08); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.og-state-title { font-family: 'Fraunces', serif; font-size: 24px; color: var(--ink); }
.og-state-title-error { color: var(--danger); }
.og-state-sub { color: var(--ink-soft); margin-top: 10px; font-size: 15px; }

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
  .og-page { padding: 40px 5%; }
  .og-grid { grid-template-columns: 1fr; gap: 26px; }
}
`;

export default Organizers;
