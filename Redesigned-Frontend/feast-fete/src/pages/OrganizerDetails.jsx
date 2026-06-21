import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  UtensilsCrossed,
  Users,
  Phone,
  Mail,
  ChefHat,
  X,
} from "lucide-react";


const OrganizerDetails = () => {
  const API2 = import.meta.env.VITE_PROFILE_URL;
  const API3 = import.meta.env.VITE_BOOKING_URL;

  const { email } = useParams();

  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [closingBooking, setClosingBooking] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mobileError, setMobileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [bookingData, setBookingData] = useState({
    customerName: "",
    customerEmail: localStorage.getItem("email") || "",
    customerMobile: "",
    customerAddress: "",
    eventDate: "",
    mealType: "",
    guestCount: "",
  });

  // FETCH ORGANIZER
  useEffect(() => {
    if (!email) {
      setError("Organizer email not found");
      setLoading(false);
      return;
    }

    fetch(`${API2}/api/organizer/${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch organizer");
        return res.json();
      })
      .then((data) => {
        setOrganizer(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Unable to load organizer");
        setLoading(false);
      });
  }, [email]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setMounted(true), 30);
      return () => clearTimeout(t);
    }
  }, [loading]);

  // close lightbox / modal on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (selectedImage) setSelectedImage(null);
        else if (showBooking) closeBookingModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage, showBooking]);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "customerName") {
      const onlyLetters = value.replace(/[^a-zA-Z\u0B80-\u0BFF\s]/g, "");
      setBookingData({ ...bookingData, customerName: onlyLetters });
      return;
    }

    if (name === "customerMobile") {
      const mobile = value.replace(/\D/g, "");
      if (mobile.length > 10) return;

      setBookingData({ ...bookingData, customerMobile: mobile });

      if (mobile.length > 0 && mobile.length !== 10) {
        setMobileError("Mobile number must be exactly 10 digits");
      } else {
        setMobileError("");
      }
      return;
    }

    setBookingData({ ...bookingData, [name]: value });
  };

  const closeBookingModal = () => {
    setClosingBooking(true);
    setTimeout(() => {
      setShowBooking(false);
      setClosingBooking(false);
    }, 220);
  };

  // BOOKING
  const handleBooking = async (e) => {
    e.preventDefault();

    if (bookingData.customerMobile.length !== 10) {
      setMobileError("Mobile number must be exactly 10 digits");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API3}/api/booking/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          organizerEmail: organizer.email,
          plateRate: organizer.plateRate,
          totalAmount: organizer.plateRate * bookingData.guestCount,
          advanceAmount:
            organizer.plateRate * bookingData.guestCount * 0.3,
        }),
      });

      if (!response.ok) throw new Error("Booking failed");

      alert("Booking Created Successfully 🔥");

      closeBookingModal();

      setBookingData({
        customerName: "",
        customerEmail: localStorage.getItem("email") || "",
        customerMobile: "",
        customerAddress: "",
        eventDate: "",
        mealType: "",
        guestCount: "",
      });
    } catch (error) {
      console.log(error);
      alert("Booking Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="od-root">
        <style>{CSS}</style>
        <SkeletonScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="od-root">
        <style>{CSS}</style>
        <StateScreen title={error} tone="error" />
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="od-root">
        <style>{CSS}</style>
        <StateScreen title="Organizer Not Found" tone="neutral" />
      </div>
    );
  }

  const images = organizer.foodImages ? organizer.foodImages.split(",") : [];

  return (
    <div className="od-root">
      <style>{CSS}</style>

      <div className="od-page">
        {/* IMAGE */}
        <div className="od-avatar-row">
          <div className="od-avatar-wrap">
            <span className="od-avatar-glow" />
            <img
              src={
                organizer.profilePhoto ||
                "https://images.unsplash.com/photo-1555244162-803834f70033"
              }
              alt={organizer.name}
              className="od-avatar"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div
          className={`od-card ${mounted ? "od-card-in" : "od-card-pre"}`}
        >
          <h1
            className="od-service-name stagger"
            style={{ "--d": "0.08s" }}
          >
            {organizer.serviceName}
          </h1>

          <h2 className="od-owner stagger" style={{ "--d": "0.14s" }}>
            <ChefHat size={20} className="od-owner-icon" />
            {organizer.name}
          </h2>

          <div className="od-info-list">
            <InfoRow icon={MapPin} delay="0.2s">
              {organizer.location}
            </InfoRow>
            <InfoRow icon={UtensilsCrossed} delay="0.25s">
              {organizer.foodType}
            </InfoRow>
            <InfoRow icon={Users} delay="0.3s">
              {organizer.minPeople} - {organizer.maxPeople} People
            </InfoRow>
            <InfoRow icon={Phone} delay="0.35s">
              {organizer.mobile}
            </InfoRow>
            <InfoRow icon={Mail} delay="0.4s">
              {organizer.email}
            </InfoRow>
          </div>

          <p className="od-rate stagger" style={{ "--d": "0.46s" }}>
            ₹ {organizer.plateRate} <span>/ Plate</span>
          </p>

          {/* BUTTON */}
          <button
            onClick={() => setShowBooking(true)}
            className="od-book-btn stagger"
            style={{ "--d": "0.52s" }}
          >
            <span className="od-book-shine" />
            Book Now
          </button>

          {/* MENU */}
          <div className="od-menu-box stagger" style={{ "--d": "0.58s" }}>
            <h2 className="od-section-title">Menu Details</h2>
            <p className="od-menu-text">{organizer.menu}</p>
          </div>

          {/* FOOD GALLERY */}
          {images.length > 0 && (
            <div className="od-gallery-section stagger" style={{ "--d": "0.64s" }}>
              <h2 className="od-section-title">Food Gallery</h2>

              <div className="od-gallery-grid">
                {images.map((img, index) => (
                  <div
                    key={img + index}
                    className="od-thumb"
                    style={{ "--gd": `${index * 0.06}s` }}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt="food" className="od-thumb-img" />
                    <span className="od-thumb-overlay">View</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOOKING POPUP */}
      {showBooking && (
        <div
          className={`od-modal-backdrop ${
            closingBooking ? "od-modal-backdrop-out" : "od-modal-backdrop-in"
          }`}
          onClick={closeBookingModal}
        >
          <form
            onSubmit={handleBooking}
            onClick={(e) => e.stopPropagation()}
            className={`od-modal-form ${
              closingBooking ? "od-modal-form-out" : "od-modal-form-in"
            }`}
          >
            <div className="od-modal-header">
              <h2 className="od-modal-title">Book Catering</h2>
              <button
                type="button"
                className="od-modal-close"
                onClick={closeBookingModal}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              name="customerName"
              placeholder="Your Name"
              value={bookingData.customerName}
              onChange={handleChange}
              required
              className="od-modal-input"
            />

            <input
              type="email"
              name="customerEmail"
              value={bookingData.customerEmail}
              readOnly
              className="od-modal-input od-modal-input-readonly"
            />

            <div className={mobileError ? "od-shake" : ""}>
              <input
                type="tel"
                name="customerMobile"
                placeholder="10 Digit Mobile Number"
                value={bookingData.customerMobile}
                inputMode="numeric"
                onChange={handleChange}
                maxLength="10"
                required
                className="od-modal-input"
              />
            </div>
            {mobileError && <p className="od-modal-error">{mobileError}</p>}

            <textarea
              name="customerAddress"
              placeholder="Door No, Street Name, Area, City, District, Pincode"
              value={bookingData.customerAddress}
              onChange={handleChange}
              minLength={15}
              required
              className="od-modal-input od-modal-textarea"
            />

            <input
              type="date"
              name="eventDate"
              value={bookingData.eventDate}
              onChange={handleChange}
              min={minDate}
              required
              className="od-modal-input"
            />

            <select
              name="mealType"
              value={bookingData.mealType}
              onChange={handleChange}
              required
              className="od-modal-input od-modal-select"
            >
              <option value="">Select Meal Type</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non Veg</option>
              <option value="Veg & Non-Veg">Veg & Non Veg</option>
            </select>

            <input
              type="number"
              name="guestCount"
              min={organizer.minPeople}
              max={organizer.maxPeople}
              placeholder="Guest Count"
              value={bookingData.guestCount}
              onChange={handleChange}
              required
              className="od-modal-input"
            />

            <button
              type="submit"
              disabled={submitting}
              className="od-modal-submit"
            >
              {submitting ? (
                <span className="od-btn-loading">
                  <span className="od-spinner" />
                  Booking…
                </span>
              ) : (
                "Confirm Booking"
              )}
            </button>

            <button
              type="button"
              onClick={closeBookingModal}
              className="od-modal-cancel"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* IMAGE LIGHTBOX */}
      {selectedImage && (
        <div
          className="od-lightbox"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="preview"
            onClick={(e) => e.stopPropagation()}
            className="od-lightbox-img"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="od-lightbox-close"
            aria-label="Close"
          >
            <X size={26} />
          </button>
        </div>
      )}
    </div>
  );
};

/* -------------------------- Small components -------------------------- */

const InfoRow = ({ icon: Icon, delay, children }) => (
  <p className="od-info-row stagger" style={{ "--d": delay }}>
    <Icon size={19} className="od-info-icon" />
    {children}
  </p>
);

const SkeletonScreen = () => (
  <div className="od-page">
    <div className="od-skel-avatar shimmer" />
    <div className="od-card">
      <div className="od-skel-line w60 shimmer" />
      <div className="od-skel-line w40 shimmer" style={{ marginTop: 14 }} />
      <div className="od-skel-block">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="od-skel-line w90 shimmer" />
        ))}
      </div>
      <div className="od-skel-btn shimmer" />
    </div>
  </div>
);

const StateScreen = ({ title, tone }) => (
  <div className="od-center">
    <div className="od-state-box od-pop-in">
      <div
        className={`od-state-icon ${
          tone === "error" ? "od-state-icon-error" : "od-state-icon-neutral"
        }`}
      >
        !
      </div>
      <h2
        className={`od-state-title ${
          tone === "error" ? "od-state-title-error" : ""
        }`}
      >
        {title}
      </h2>
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
}

.od-root * { box-sizing: border-box; }
.od-root { font-family: 'Inter', system-ui, sans-serif; color: var(--ink); }

.od-page { min-height: 100vh; background: var(--cream); padding: 50px 8%; }
.od-center {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--cream);
  padding: 40px;
}

.stagger {
  opacity: 0;
  transform: translateY(10px);
  animation: staggerIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes staggerIn { to { opacity: 1; transform: translateY(0); } }

/* ----- Avatar ----- */
.od-avatar-row { display: flex; justify-content: center; padding: 25px; }
.od-avatar-wrap { position: relative; width: 170px; height: 170px; }
.od-avatar-glow {
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(184,137,73,0.3) 0%, rgba(184,137,73,0) 70%);
  animation: glowPulse 3.2s ease-in-out infinite;
}
@keyframes glowPulse {
  0%, 100% { transform: scale(0.94); opacity: 0.7; }
  50%      { transform: scale(1.08); opacity: 1; }
}
.od-avatar {
  position: relative;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid var(--ink);
  display: block;
  animation: avatarPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes avatarPop {
  from { opacity: 0; transform: scale(0.75); }
  to   { opacity: 1; transform: scale(1); }
}

/* ----- Card ----- */
.od-card {
  background: var(--surface);
  padding: 40px;
  border-radius: 24px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}
.od-card-pre { opacity: 0; transform: translateY(18px); }
.od-card-in {
  animation: cardRise 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes cardRise {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

.od-service-name {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(32px, 4.5vw, 48px);
  color: var(--ink);
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}
.od-owner {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #666;
  margin-bottom: 22px;
  font-size: 19px;
  font-weight: 500;
}
.od-owner-icon { color: var(--accent); }

.od-info-list { display: flex; flex-direction: column; }
.od-info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
  padding: 9px 8px;
  font-size: 18px;
  border-radius: 10px;
  transition: background 0.2s ease, padding-left 0.2s ease;
}
.od-info-row:hover {
  background: var(--cream);
  padding-left: 14px;
}
.od-info-icon { color: var(--accent); flex-shrink: 0; }

.od-rate {
  margin-top: 18px;
  margin-bottom: 28px;
  font-size: 28px;
  color: var(--accent);
  font-weight: 700;
}
.od-rate span { font-size: 16px; font-weight: 500; color: var(--ink-soft); }

/* ----- Book button ----- */
.od-book-btn {
  position: relative;
  overflow: hidden;
  padding: 16px 34px;
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-bottom: 32px;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.od-book-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(43,20,8,0.3);
  filter: brightness(1.1);
}
.od-book-btn:active { transform: scale(0.97); }
.od-book-shine {
  position: absolute;
  top: 0; left: -150%;
  width: 50%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent);
  animation: shineSweep 3s ease-in-out infinite;
}
@keyframes shineSweep {
  0%   { left: -150%; }
  60%  { left: 150%; }
  100% { left: 150%; }
}

/* ----- Menu box ----- */
.od-menu-box {
  background: var(--cream);
  padding: 25px;
  border-radius: 18px;
}
.od-section-title {
  margin-bottom: 20px;
  color: var(--ink);
  font-family: 'Fraunces', serif;
  font-size: 24px;
  font-weight: 600;
}
.od-menu-text {
  line-height: 2;
  color: #555;
  white-space: pre-line;
}

/* ----- Gallery ----- */
.od-gallery-section { margin-top: 40px; }
.od-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.od-thumb {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.92);
  animation: thumbIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--gd, 0s);
}
@keyframes thumbIn { to { opacity: 1; transform: scale(1); } }
.od-thumb-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease, filter 0.3s ease;
}
.od-thumb:hover .od-thumb-img {
  transform: scale(1.1);
  filter: brightness(0.8);
}
.od-thumb-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: rgba(0,0,0,0.15);
}
.od-thumb:hover .od-thumb-overlay { opacity: 1; }

/* ----- Lightbox ----- */
.od-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 0;
  animation: fadeIn 0.25s ease forwards;
}
@keyframes fadeIn { to { opacity: 1; } }
.od-lightbox-img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 10px;
  transform: scale(0.9);
  animation: zoomIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes zoomIn { to { transform: scale(1); } }
.od-lightbox-close {
  position: absolute;
  top: 20px; right: 20px;
  width: 46px; height: 46px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}
.od-lightbox-close:hover {
  background: rgba(255,255,255,0.22);
  transform: rotate(90deg);
}

/* ----- Booking modal ----- */
.od-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
  opacity: 0;
}
.od-modal-backdrop-in { animation: fadeIn 0.25s ease forwards; }
.od-modal-backdrop-out { animation: fadeOut 0.2s ease forwards; }
@keyframes fadeOut { to { opacity: 0; } }

.od-modal-form {
  background: #fff;
  padding: 36px;
  border-radius: 24px;
  width: 450px;
  max-width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transform: scale(0.92) translateY(16px);
  opacity: 0;
}
.od-modal-form-in {
  animation: modalIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.od-modal-form-out {
  animation: modalOut 0.2s ease forwards;
}
@keyframes modalIn {
  to { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes modalOut {
  to { transform: scale(0.95) translateY(8px); opacity: 0; }
}

.od-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.od-modal-title {
  font-family: 'Fraunces', serif;
  font-size: 24px;
  font-weight: 600;
}
.od-modal-close {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: none;
  background: var(--cream);
  color: var(--ink-soft);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}
.od-modal-close:hover {
  background: #f0e4d4;
  transform: rotate(90deg);
}

.od-modal-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  font-size: 15px;
  font-family: inherit;
  background: var(--cream);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.od-modal-input:focus {
  outline: none;
  border-color: var(--accent);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(184,137,73,0.15);
}
.od-modal-input-readonly { background: #eee; color: #888; cursor: not-allowed; }
.od-modal-textarea { min-height: 80px; resize: vertical; }
.od-modal-select { cursor: pointer; }

.od-modal-error {
  color: var(--danger);
  font-size: 13px;
  margin-top: -10px;
  font-weight: 500;
}

.od-shake { animation: fieldShake 0.4s ease; }
@keyframes fieldShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.od-modal-submit {
  padding: 15px;
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 15.5px;
  font-family: inherit;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.od-modal-submit:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(43,20,8,0.3);
  filter: brightness(1.1);
}
.od-modal-submit:disabled { opacity: 0.65; cursor: not-allowed; }

.od-modal-cancel {
  padding: 14px;
  background: #eee;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  font-family: inherit;
  color: var(--ink-soft);
  transition: background 0.2s ease;
}
.od-modal-cancel:hover { background: #e2e2e2; }

.od-btn-loading { display: inline-flex; align-items: center; gap: 9px; justify-content: center; width: 100%; }
.od-spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ----- Skeleton ----- */
.od-skel-avatar {
  width: 170px; height: 170px; border-radius: 50%;
  margin: 25px auto; display: block;
}
.od-skel-line { height: 20px; border-radius: 8px; margin-top: 16px; }
.w60 { width: 60%; }
.w40 { width: 40%; }
.w90 { width: 95%; }
.od-skel-block { margin-top: 26px; }
.od-skel-btn { width: 160px; height: 50px; border-radius: 14px; margin-top: 30px; }

.shimmer {
  background: linear-gradient(90deg, #ece3d4 25%, #f6f0e6 37%, #ece3d4 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* ----- State screen (error / not found) ----- */
.od-state-box {
  text-align: center;
  background: var(--surface);
  padding: 56px 48px;
  border-radius: 24px;
  box-shadow: var(--shadow);
  max-width: 420px;
  border: 1px solid var(--border);
}
.od-pop-in { animation: cardRise 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.od-state-icon {
  width: 56px; height: 56px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px;
  font-weight: 700;
}
.od-state-icon-error { background: #fdecea; color: var(--danger); animation: shake 0.5s ease 0.3s; }
.od-state-icon-neutral { background: var(--accent-soft); color: var(--accent); }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.od-state-title { font-family: 'Fraunces', serif; font-size: 22px; color: var(--ink); }
.od-state-title-error { color: var(--danger); }

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
  .od-page { padding: 30px 5%; }
  .od-card { padding: 26px; border-radius: 20px; }
  .od-modal-form { padding: 26px; border-radius: 18px; }
}
`;

export default OrganizerDetails;
