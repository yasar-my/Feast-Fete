import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const API2 = import.meta.env.VITE_PROFILE_URL;
  const CLUD = import.meta.env.VITE_CLUD_URL;

  const navigate = useNavigate();

  const role = localStorage.getItem("role")?.toUpperCase();
  const email = localStorage.getItem("email");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [foodImages, setFoodImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef(null);

  const handleFoodImages = (e) => {
    setFoodImages(Array.from(e.target.files));
  };

  const uploadFoodImages = async () => {
    if (!foodImages.length) return;
    setUploading(true);

    try {
      const urls = [];

      for (const file of foodImages) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "feast_fete_upload");

        const response = await fetch(
          `${CLUD}/v1_1/dmytd1bjy/image/upload`,
          { method: "POST", body: data }
        );

        const result = await response.json();
        urls.push(result.secure_url);
      }

      const existingImages = profile.foodImages
        ? profile.foodImages.split(",")
        : [];

      const updatedProfile = {
        ...profile,
        foodImages: [...existingImages, ...urls].join(","),
      };

      setProfile(updatedProfile);
      setFoodImages([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await fetch(`${API2}/api/organizer/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (index) => {
    setDeletingIndex(index);

    const images = profile.foodImages.split(",");

    await new Promise((res) => setTimeout(res, 260));

    const updatedImages = images.filter((_, i) => i !== index);

    const updatedProfile = {
      ...profile,
      foodImages: updatedImages.join(","),
    };

    setProfile(updatedProfile);
    setDeletingIndex(null);

    await fetch(`${API2}/api/organizer/${profile.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProfile),
    });
  };

  useEffect(() => {
    if (role === "ORGANIZER") {
      fetch(`${API2}/api/organizer/${email}`)
        .then(async (res) => {
          if (!res.ok) throw new Error("Organizer Profile Not Found");
          return res.json();
        })
        .then((data) => {
          setProfile(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Organizer Profile Not Found");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [email, role]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setMounted(true), 30);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="ff-root">
      <style>{CSS}</style>

      {loading && <SkeletonScreen />}

      {!loading && error && (
        <ErrorScreen error={error} navigate={navigate} />
      )}

      {!loading && !error && role === "ORGANIZER" && profile && (
        <OrganizerScreen
          profile={profile}
          mounted={mounted}
          navigate={navigate}
          fileInputRef={fileInputRef}
          handleFoodImages={handleFoodImages}
          uploadFoodImages={uploadFoodImages}
          uploading={uploading}
          foodImages={foodImages}
          deleteImage={deleteImage}
          deletingIndex={deletingIndex}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}

      {!loading && !error && role !== "ORGANIZER" && (
        <CustomerScreen mounted={mounted} />
      )}
    </div>
  );
};

/* ---------------------------- Skeleton ---------------------------- */

const SkeletonScreen = () => (
  <div className="ff-center">
    <div className="ff-card ff-skel-card">
      <div className="ff-skel-avatar shimmer" />
      <div className="ff-skel-line w60 shimmer" />
      <div className="ff-skel-line w40 shimmer" />
      <div className="ff-skel-block">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="ff-skel-line w90 shimmer" />
        ))}
      </div>
    </div>
  </div>
);

/* ----------------------------- Error ------------------------------ */

const ErrorScreen = ({ error, navigate }) => (
  <div className="ff-center">
    <div className="ff-error-box ff-pop-in">
      <div className="ff-error-icon">!</div>
      <h1 className="ff-error-title">{error}</h1>
      <p className="ff-error-sub">
        Set up your organizer profile to start receiving bookings.
      </p>
      <button
        className="ff-btn ff-btn-primary"
        onClick={() => navigate("/create-organizer-profile")}
      >
        Create Profile
      </button>
    </div>
  </div>
);

/* ---------------------------- Organizer ---------------------------- */

const OrganizerScreen = ({
  profile,
  mounted,
  navigate,
  fileInputRef,
  handleFoodImages,
  uploadFoodImages,
  uploading,
  foodImages,
  deleteImage,
  deletingIndex,
  selectedImage,
  setSelectedImage,
}) => {
  const details = [
    ["Location", profile.location],
    ["Email", profile.email],
    ["Mobile", profile.mobile],
    ["Food Type", profile.foodType],
    ["Minimum People", profile.minPeople],
    ["Maximum People", profile.maxPeople],
    ["Plate Rate", profile.plateRate != null ? `₹${profile.plateRate}` : null],
    ["Menu", profile.menu],
  ].filter(([, v]) => v !== null && v !== undefined && v !== "");

  const images = profile.foodImages ? profile.foodImages.split(",") : [];

  return (
    <div className="ff-page">
      <div className={`ff-card ${mounted ? "ff-card-in" : "ff-card-pre"}`}>
        {/* HERO */}
        <div className="ff-hero">
          <div className="ff-avatar-wrap">
            <span className="ff-avatar-glow" />
            <img
              className="ff-avatar"
              src={
                profile.profilePhoto ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
            />
          </div>

          <h1 className="ff-service-name stagger" style={{ "--d": "0.10s" }}>
            {profile.serviceName}
          </h1>
          <h2 className="ff-owner-name stagger" style={{ "--d": "0.18s" }}>
            {profile.name}
          </h2>
        </div>

        {/* DETAILS */}
        <div className="ff-details">
          {details.map(([label, value], i) => (
            <div
              key={label}
              className="ff-detail-row stagger"
              style={{ "--d": `${0.24 + i * 0.05}s` }}
            >
              <span className="ff-detail-label">{label}</span>
              <span className="ff-detail-value">{value}</span>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div
          className="ff-actions stagger"
          style={{ "--d": `${0.24 + details.length * 0.05 + 0.05}s` }}
        >
          <button
            className="ff-btn ff-btn-primary ff-btn-flex"
            onClick={() => navigate("/edit-organizer-profile")}
          >
            Edit Profile
          </button>
          <button
            className="ff-btn ff-btn-danger ff-btn-flex"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        {/* UPLOAD */}
        <div
          className="ff-upload stagger"
          style={{ "--d": `${0.24 + details.length * 0.05 + 0.1}s` }}
        >
          <label className="ff-file-label">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFoodImages}
              className="ff-file-input"
            />
            <span className="ff-file-icon">+</span>
            <span>
              {foodImages.length > 0
                ? `${foodImages.length} file${
                    foodImages.length > 1 ? "s" : ""
                  } selected`
                : "Choose food photos"}
            </span>
          </label>

          <button
            className="ff-btn ff-btn-primary"
            onClick={uploadFoodImages}
            disabled={uploading || foodImages.length === 0}
          >
            {uploading ? (
              <span className="ff-btn-loading">
                <span className="ff-spinner" />
                Uploading…
              </span>
            ) : (
              "Add Images"
            )}
          </button>
        </div>

        {/* GALLERY */}
        {images.length > 0 && (
          <div className="ff-gallery-section">
            <h2 className="ff-gallery-title">Food Gallery</h2>

            <div className="ff-gallery-grid">
              {images.map((img, index) => (
                <div
                  key={img + index}
                  className={`ff-thumb stagger-grid ${
                    deletingIndex === index ? "ff-thumb-out" : ""
                  }`}
                  style={{ "--gd": `${index * 0.05}s` }}
                >
                  <img
                    src={img}
                    alt="food"
                    onClick={() => setSelectedImage(img)}
                    className="ff-thumb-img"
                  />
                  <button
                    className="ff-thumb-delete"
                    onClick={() => deleteImage(index)}
                    aria-label="Delete image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div
          className="ff-lightbox ff-lightbox-in"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="preview"
            className="ff-lightbox-img"
          />
          <button
            className="ff-lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------------------- Customer ----------------------------- */

const CustomerScreen = ({ mounted }) => (
  <div className="ff-center">
    <div className={`ff-welcome ${mounted ? "ff-card-in" : "ff-card-pre"}`}>
      <span className="ff-welcome-glow" />
      <h1 className="ff-welcome-title">Welcome Customer</h1>
      <p className="ff-welcome-sub">Book Best Catering Services</p>
      <div className="ff-welcome-shine" />
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
  --accent-dark: #b8602b;
  --danger: #C0392B;
  --success: #3F7D4F;
  --border: #eee2d4;
  --shadow: 0 20px 50px rgba(43, 20, 8, 0.10);
}

.ff-root * { box-sizing: border-box; }
.ff-root {
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--ink);
}

.ff-page, .ff-center {
  min-height: 100vh;
  background: radial-gradient(circle at 10% 0%, #fff 0%, var(--cream) 55%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

/* ----- Card shell + entrance ----- */
.ff-card {
  width: 100%;
  max-width: 850px;
  background: var(--surface);
  border-radius: 28px;
  padding: 48px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}
.ff-card-pre { opacity: 0; transform: translateY(18px); }
.ff-card-in {
  animation: cardRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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
@keyframes staggerIn {
  to { opacity: 1; transform: translateY(0); }
}

/* ----- Hero / avatar ----- */
.ff-hero { text-align: center; position: relative; }

.ff-avatar-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
}
.ff-avatar-glow {
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
.ff-avatar {
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

.ff-service-name {
  margin-top: 24px;
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(34px, 5vw, 50px);
  color: var(--ink);
  letter-spacing: -0.01em;
}
.ff-owner-name {
  margin-top: 8px;
  color: var(--ink-soft);
  font-size: 18px;
  font-weight: 500;
}

/* ----- Details ----- */
.ff-details {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
}
.ff-detail-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 4px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s ease, padding-left 0.2s ease;
}
.ff-detail-row:hover {
  background: var(--cream);
  padding-left: 12px;
  border-radius: 8px;
}
.ff-detail-row:last-child { border-bottom: none; }
.ff-detail-label {
  font-weight: 600;
  color: var(--ink-soft);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.ff-detail-value {
  font-size: 17px;
  font-weight: 500;
  text-align: right;
}

/* ----- Buttons ----- */
.ff-btn {
  padding: 16px 28px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  position: relative;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.ff-btn:active { transform: scale(0.97); }
.ff-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.ff-btn-primary {
  background: var(--ink);
  color: #fff;
}
.ff-btn-primary:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(43, 20, 8, 0.28);
  filter: brightness(1.08);
}
.ff-btn-danger {
  background: var(--danger);
  color: #fff;
}
.ff-btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(192, 57, 43, 0.3);
  filter: brightness(1.05);
}

.ff-actions { display: flex; gap: 18px; margin-top: 32px; }
.ff-btn-flex { flex: 1; }

.ff-btn-loading { display: inline-flex; align-items: center; gap: 10px; }
.ff-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ----- Upload ----- */
.ff-upload {
  margin-top: 36px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 28px;
  border-top: 1px dashed var(--border);
}
.ff-file-label {
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border: 1.5px dashed var(--accent);
  border-radius: 14px;
  cursor: pointer;
  font-weight: 500;
  color: var(--accent-dark);
  background: #fdf3ea;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.ff-file-label:hover { background: #fbe9d8; }
.ff-file-icon {
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
}
.ff-file-input { display: none; }

/* ----- Gallery ----- */
.ff-gallery-section { margin-top: 36px; }
.ff-gallery-title {
  font-family: 'Fraunces', serif;
  font-size: 24px;
  font-weight: 600;
}
.ff-gallery-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
}
.ff-thumb {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  opacity: 0;
  transform: scale(0.9);
  animation: thumbIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--gd, 0s);
}
@keyframes thumbIn {
  to { opacity: 1; transform: scale(1); }
}
.ff-thumb-out {
  animation: thumbOut 0.26s ease forwards !important;
}
@keyframes thumbOut {
  to { opacity: 0; transform: scale(0.85); }
}
.ff-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  display: block;
  transition: transform 0.4s ease, filter 0.3s ease;
}
.ff-thumb:hover .ff-thumb-img {
  transform: scale(1.08);
  filter: brightness(0.85);
}
.ff-thumb-delete {
  position: absolute;
  top: 8px; right: 8px;
  width: 30px; height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease;
  backdrop-filter: blur(2px);
}
.ff-thumb:hover .ff-thumb-delete {
  opacity: 1;
  transform: scale(1);
}
.ff-thumb-delete:hover { background: var(--danger); }

/* ----- Lightbox ----- */
.ff-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(20, 10, 4, 0.82);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 0;
  animation: lightboxFade 0.25s ease forwards;
}
@keyframes lightboxFade { to { opacity: 1; } }
.ff-lightbox-img {
  max-width: 85%;
  max-height: 85%;
  border-radius: 18px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  transform: scale(0.9);
  animation: lightboxZoom 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes lightboxZoom { to { transform: scale(1); } }
.ff-lightbox-close {
  position: absolute;
  top: 28px; right: 32px;
  width: 44px; height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.12);
  color: #fff;
  font-size: 26px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}
.ff-lightbox-close:hover {
  background: rgba(255,255,255,0.25);
  transform: rotate(90deg);
}

/* ----- Skeleton ----- */
.ff-skel-card { display: flex; flex-direction: column; align-items: center; }
.ff-skel-avatar {
  width: 180px; height: 180px; border-radius: 50%;
  margin-bottom: 24px;
}
.ff-skel-line {
  height: 16px;
  border-radius: 8px;
  margin-top: 12px;
}
.ff-skel-block { width: 100%; margin-top: 24px; }
.w60 { width: 60%; }
.w40 { width: 40%; }
.w90 { width: 100%; height: 20px; margin-top: 18px; }

.shimmer {
  background: linear-gradient(90deg, #f1e9dd 25%, #faf4ec 37%, #f1e9dd 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* ----- Error ----- */
.ff-error-box {
  text-align: center;
  background: var(--surface);
  padding: 56px 44px;
  border-radius: 24px;
  box-shadow: var(--shadow);
  max-width: 420px;
}
.ff-pop-in { animation: cardRise 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.ff-error-icon {
  width: 56px; height: 56px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #fdecea;
  color: var(--danger);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px;
  font-weight: 700;
  animation: shake 0.5s ease 0.3s;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.ff-error-title { font-family: 'Fraunces', serif; font-size: 24px; color: var(--danger); }
.ff-error-sub { color: var(--ink-soft); margin-top: 10px; font-size: 15px; }
.ff-error-box .ff-btn { margin-top: 26px; }

/* ----- Customer welcome ----- */
.ff-welcome {
  position: relative;
  background: var(--surface);
  padding: 60px 56px;
  border-radius: 24px;
  box-shadow: var(--shadow);
  text-align: center;
  overflow: hidden;
}
.ff-welcome-glow {
  position: absolute;
  top: -60px; left: 50%;
  width: 240px; height: 240px;
  transform: translateX(-50%);
  background: radial-gradient(circle, rgba(217,123,63,0.25), transparent 70%);
  animation: glowPulse 4s ease-in-out infinite;
}
.ff-welcome-title {
  position: relative;
  font-family: 'Fraunces', serif;
  font-size: clamp(36px, 5vw, 54px);
  color: var(--ink);
  animation: fadeUp 0.6s ease 0.1s both;
}
.ff-welcome-sub {
  position: relative;
  margin-top: 14px;
  color: var(--ink-soft);
  font-size: 18px;
  animation: fadeUp 0.6s ease 0.25s both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ff-welcome-shine {
  position: absolute;
  top: 0; left: -150%;
  width: 60%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(217,123,63,0.12), transparent);
  animation: shine 3.5s ease-in-out infinite;
}
@keyframes shine {
  0%   { left: -150%; }
  50%  { left: 150%; }
  100% { left: 150%; }
}

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
  .ff-card, .ff-error-box, .ff-welcome { padding: 30px 22px; border-radius: 20px; }
  .ff-actions { flex-direction: column; }
  .ff-detail-row { flex-direction: column; gap: 4px; }
  .ff-detail-value { text-align: left; }
}
`;

export default Dashboard;
