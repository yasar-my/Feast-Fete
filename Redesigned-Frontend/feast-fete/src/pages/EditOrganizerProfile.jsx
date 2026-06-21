import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const EditOrganizerProfile = () => {
  const API2 = import.meta.env.VITE_PROFILE_URL;
  const CLUD = import.meta.env.VITE_CLUD_URL;

  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [profileId, setProfileId] = useState(null);
  const [preview, setPreview] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    profilePhoto: "",
    serviceName: "",
    name: "",
    location: "Tenkasi",
    email: email,
    mobile: "",
    foodType: "Veg",
    minPeople: "",
    maxPeople: "",
    menu: "",
    plateRate: "",
  });

  const [errors, setErrors] = useState({});
  const [shakeField, setShakeField] = useState("");

  // FETCH PROFILE
  useEffect(() => {
    fetch(`${API2}/api/organizer/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setProfileId(data.id);
        setFormData(data);
        setPreview(data.profilePhoto);
        setLoadingProfile(false);
      })
      .catch(() => setLoadingProfile(false));
  }, [email]);

  useEffect(() => {
    if (!loadingProfile) {
      const t = setTimeout(() => setMounted(true), 30);
      return () => clearTimeout(t);
    }
  }, [loadingProfile]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "serviceName" || name === "name") {
      const onlyLetters = value.replace(/[^a-zA-Z\u0B80-\u0BFF\s]/g, "");
      setFormData({ ...formData, [name]: onlyLetters });
      setErrors({ ...errors, [name]: "" });
      return;
    }

    if (name === "mobile") {
      const onlyNums = value.replace(/\D/g, "");
      if (onlyNums.length > 10) return;
      setFormData({ ...formData, mobile: onlyNums });
      setErrors({ ...errors, mobile: "" });
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // IMAGE CHANGE
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors({
        ...errors,
        profilePhoto: "Only JPG, JPEG, PNG, WEBP Images Allowed",
      });
      triggerShake("profilePhoto");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        profilePhoto: "Image Size Must Be Below 5MB",
      });
      triggerShake("profilePhoto");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setImageUploading(true);

    try {
      const cloudinaryUrl = await uploadImageToCloudinary(file);

      setFormData((prev) => ({ ...prev, profilePhoto: cloudinaryUrl }));
      setErrors((prev) => ({ ...prev, profilePhoto: "" }));
    } catch (err) {
      console.log(err);
      setErrors((prev) => ({
        ...prev,
        profilePhoto: "Image Upload Failed",
      }));
    } finally {
      setImageUploading(false);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "feast_fete_upload");

    const response = await fetch(
      `${CLUD}/v1_1/dmytd1bjy/image/upload`,
      { method: "POST", body: data }
    );

    const result = await response.json();
    return result.secure_url;
  };

  const triggerShake = (field) => {
    setShakeField(field);
    setTimeout(() => setShakeField(""), 420);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (formData.mobile.length !== 10) {
      newErrors.mobile = "Mobile Number Must Be 10 Digits";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter Valid 10 Digit Mobile Number";
    }

    if (Number(formData.minPeople) < 100) {
      newErrors.minPeople = "Minimum People Must Be Atleast 100";
    }

    if (Number(formData.maxPeople) > 10000) {
      newErrors.maxPeople = "Maximum People Must Be Below 10000";
    }

    if (Number(formData.maxPeople) <= Number(formData.minPeople)) {
      newErrors.maxPeople =
        "Maximum People Must Be Greater Than Minimum People";
    }

    if (Number(formData.plateRate) < 50) {
      newErrors.plateRate = "Plate Rate Minimum ₹50";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake(Object.keys(newErrors)[0]);

      // scroll first error into view
      const el = document.querySelector(
        `[name="${Object.keys(newErrors)[0]}"]`
      );
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch(`${API2}/api/organizer/${profileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Update Failed");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  return (
    <div className="ep-root">
      <style>{CSS}</style>

      <div className="ep-page">
        {loadingProfile ? (
          <div className="ep-form ep-skel-card">
            <div className="ep-skel-line w50 shimmer" />
            <div className="ep-skel-avatar shimmer" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="ep-skel-field shimmer" />
            ))}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`ep-form ${mounted ? "ep-form-in" : "ep-form-pre"}`}
          >
            <h1 className="ep-title stagger" style={{ "--d": "0.05s" }}>
              Edit Organizer Profile
            </h1>

            {/* IMAGE */}
            <div className="ep-field stagger" style={{ "--d": "0.1s" }}>
              <label className="ep-label">Profile Photo</label>

              <div className="ep-photo-row">
                <div className="ep-photo-preview-wrap">
                  {(preview || formData.profilePhoto) && (
                    <img
                      src={preview || formData.profilePhoto}
                      alt="preview"
                      className="ep-photo-preview"
                    />
                  )}
                  {imageUploading && (
                    <div className="ep-photo-overlay">
                      <span className="ep-spinner" />
                    </div>
                  )}
                </div>

                <label className="ep-file-label">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageChange}
                    className="ep-file-input"
                  />
                  <span className="ep-file-icon">↑</span>
                  <span>Change Photo</span>
                </label>
              </div>

              <ErrorText
                show={!!errors.profilePhoto}
                text={errors.profilePhoto}
              />
            </div>

            {/* SERVICE NAME */}
            <FloatField
              delay="0.14s"
              shake={shakeField === "serviceName"}
            >
              <input
                type="text"
                name="serviceName"
                placeholder=" "
                value={formData.serviceName}
                onChange={handleChange}
                required
                className="ep-input"
                id="serviceName"
              />
              <label htmlFor="serviceName" className="ep-float-label">
                Service Name
              </label>
            </FloatField>

            {/* NAME */}
            <FloatField delay="0.18s" shake={shakeField === "name"}>
              <input
                type="text"
                name="name"
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                required
                className="ep-input"
                id="name"
              />
              <label htmlFor="name" className="ep-float-label">
                Organizer Name
              </label>
            </FloatField>

            {/* LOCATION */}
            <div className="ep-field stagger" style={{ "--d": "0.22s" }}>
              <label className="ep-label">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="ep-select"
              >
                <option value="Tenkasi">Tenkasi</option>
                <option value="Sankarankovil">Sankarankovil</option>
                <option value="Kadayanallur">Kadayanallur</option>
                <option value="Courtallam">Courtallam</option>
                <option value="Shenkottai">Shenkottai</option>
                <option value="Alangulam">Alangulam</option>
                <option value="Puliyangudi">Puliyangudi</option>
                <option value="Surandai">Surandai</option>
              </select>
            </div>

            {/* EMAIL */}
            <div className="ep-field stagger" style={{ "--d": "0.26s" }}>
              <label className="ep-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="ep-input ep-input-readonly"
              />
            </div>

            {/* MOBILE */}
            <FloatField delay="0.3s" shake={shakeField === "mobile"}>
              <input
                type="text"
                name="mobile"
                placeholder=" "
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                required
                className="ep-input"
                id="mobile"
              />
              <label htmlFor="mobile" className="ep-float-label">
                Mobile Number
              </label>
            </FloatField>
            <ErrorText show={!!errors.mobile} text={errors.mobile} />

            {/* FOOD TYPE */}
            <div className="ep-field stagger" style={{ "--d": "0.34s" }}>
              <label className="ep-label">Food Type</label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="ep-select"
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Chinese">Chinese</option>
                <option value="South Indian">South Indian</option>
                <option value="North Indian">North Indian</option>
                <option value="BBQ">BBQ</option>
                <option value="Sea Food">Sea Food</option>
                <option value="Arabian">Arabian</option>
              </select>
            </div>

            {/* MIN PEOPLE */}
            <FloatField delay="0.38s" shake={shakeField === "minPeople"}>
              <input
                type="number"
                name="minPeople"
                placeholder=" "
                value={formData.minPeople}
                onChange={handleChange}
                required
                min="100"
                className="ep-input"
                id="minPeople"
              />
              <label htmlFor="minPeople" className="ep-float-label">
                Minimum People
              </label>
            </FloatField>
            <ErrorText show={!!errors.minPeople} text={errors.minPeople} />

            {/* MAX PEOPLE */}
            <FloatField delay="0.42s" shake={shakeField === "maxPeople"}>
              <input
                type="number"
                name="maxPeople"
                placeholder=" "
                value={formData.maxPeople}
                onChange={handleChange}
                required
                min="110"
                className="ep-input"
                id="maxPeople"
              />
              <label htmlFor="maxPeople" className="ep-float-label">
                Maximum People
              </label>
            </FloatField>
            <ErrorText show={!!errors.maxPeople} text={errors.maxPeople} />

            {/* MENU */}
            <FloatField delay="0.46s" shake={shakeField === "menu"}>
              <textarea
                name="menu"
                placeholder=" "
                value={formData.menu}
                onChange={handleChange}
                required
                className="ep-input ep-textarea"
                id="menu"
              />
              <label htmlFor="menu" className="ep-float-label">
                Menu Details
              </label>
            </FloatField>

            {/* PLATE RATE */}
            <FloatField delay="0.5s" shake={shakeField === "plateRate"}>
              <input
                type="number"
                name="plateRate"
                placeholder=" "
                value={formData.plateRate}
                onChange={handleChange}
                required
                min="50"
                className="ep-input"
                id="plateRate"
              />
              <label htmlFor="plateRate" className="ep-float-label">
                Plate Rate (₹)
              </label>
            </FloatField>
            <ErrorText show={!!errors.plateRate} text={errors.plateRate} />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className="ep-submit stagger"
              style={{ "--d": "0.56s" }}
            >
              {submitting ? (
                <span className="ep-btn-loading">
                  <span className="ep-spinner" />
                  Updating…
                </span>
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* -------------------- Small presentational helpers -------------------- */

const FloatField = ({ children, delay, shake }) => (
  <div
    className={`ep-field ep-float-wrap stagger ${shake ? "ep-shake" : ""}`}
    style={{ "--d": delay }}
  >
    {children}
  </div>
);

const ErrorText = ({ show, text }) =>
  show ? <p className="ep-error">{text}</p> : null;

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
  --border: #e7dcc9;
  --border-focus: #D97B3F;
  --shadow: 0 20px 50px rgba(43, 20, 8, 0.10);
}

.ep-root * { box-sizing: border-box; }
.ep-root { font-family: 'Inter', system-ui, sans-serif; color: var(--ink); }

.ep-page {
  min-height: 100vh;
  background: radial-gradient(circle at 90% 0%, #fff 0%, var(--cream) 55%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

/* ----- Form shell ----- */
.ep-form {
  width: 100%;
  max-width: 750px;
  background: var(--surface);
  padding: 48px;
  border-radius: 26px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}
.ep-form-pre { opacity: 0; transform: translateY(18px); }
.ep-form-in { animation: formRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes formRise {
  from { opacity: 0; transform: translateY(18px) scale(0.985); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.stagger {
  opacity: 0;
  transform: translateY(10px);
  animation: staggerIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes staggerIn { to { opacity: 1; transform: translateY(0); } }

.ep-title {
  text-align: center;
  margin-bottom: 36px;
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(30px, 4.5vw, 44px);
  color: var(--ink);
  letter-spacing: -0.01em;
}

.ep-field { margin-bottom: 22px; }

.ep-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 14px;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ----- Floating-label inputs ----- */
.ep-float-wrap { position: relative; }

.ep-input {
  width: 100%;
  padding: 22px 18px 10px;
  border-radius: 14px;
  border: 1.5px solid var(--border);
  font-size: 16px;
  font-family: inherit;
  color: var(--ink);
  background: var(--cream);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.ep-input:focus {
  outline: none;
  border-color: var(--border-focus);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(217,123,63,0.15);
}
.ep-input-readonly {
  background: #efe9e1;
  color: var(--ink-soft);
  cursor: not-allowed;
  padding: 16px 18px;
}
.ep-textarea { height: 140px; resize: vertical; padding-top: 26px; }

.ep-float-label {
  position: absolute;
  left: 18px;
  top: 16px;
  font-size: 16px;
  color: var(--ink-soft);
  pointer-events: none;
  transition: all 0.18s ease;
  background: transparent;
}
.ep-input:focus ~ .ep-float-label,
.ep-input:not(:placeholder-shown) ~ .ep-float-label {
  top: 7px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--accent-dark);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.ep-textarea ~ .ep-float-label { top: 16px; }
.ep-textarea:focus ~ .ep-float-label,
.ep-textarea:not(:placeholder-shown) ~ .ep-float-label {
  top: 8px;
}

/* ----- Select ----- */
.ep-select {
  width: 100%;
  padding: 16px 18px;
  border-radius: 14px;
  border: 1.5px solid var(--border);
  font-size: 16px;
  font-family: inherit;
  background: var(--cream);
  color: var(--ink);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9'%3E%3Cpath d='M1 1l6 6 6-6' stroke='%236b5a4d' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
}
.ep-select:focus {
  outline: none;
  border-color: var(--border-focus);
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(217,123,63,0.15);
}

/* ----- Errors + shake ----- */
.ep-error {
  color: var(--danger);
  font-size: 13.5px;
  font-weight: 500;
  margin: -14px 0 16px 4px;
  animation: errorIn 0.25s ease;
}
@keyframes errorIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ep-shake .ep-input,
.ep-shake .ep-select {
  border-color: var(--danger);
  animation: fieldShake 0.4s ease;
}
@keyframes fieldShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

/* ----- Photo upload ----- */
.ep-photo-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.ep-photo-preview-wrap {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ep-photo-preview {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--ink);
  animation: photoPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes photoPop {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}
.ep-photo-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(43,20,8,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ep-file-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 22px;
  border: 1.5px dashed var(--accent);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14.5px;
  color: var(--accent-dark);
  background: #fdf3ea;
  transition: background 0.2s ease;
}
.ep-file-label:hover { background: #fbe9d8; }
.ep-file-icon {
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
}
.ep-file-input { display: none; }

/* ----- Submit button ----- */
.ep-submit {
  width: 100%;
  padding: 18px;
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 17px;
  font-weight: 600;
  font-family: inherit;
  margin-top: 12px;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.ep-submit:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(43, 20, 8, 0.3);
  filter: brightness(1.08);
}
.ep-submit:active { transform: scale(0.98); }
.ep-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.ep-btn-loading { display: inline-flex; align-items: center; gap: 10px; justify-content: center; width: 100%; }
.ep-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ----- Skeleton ----- */
.ep-skel-card { display: flex; flex-direction: column; align-items: center; }
.ep-skel-line { height: 30px; border-radius: 8px; }
.w50 { width: 50%; margin-bottom: 30px; }
.ep-skel-avatar { width: 96px; height: 96px; border-radius: 50%; margin-bottom: 24px; align-self: flex-start; }
.ep-skel-field { width: 100%; height: 54px; border-radius: 14px; margin-bottom: 20px; }

.shimmer {
  background: linear-gradient(90deg, #f1e9dd 25%, #faf4ec 37%, #f1e9dd 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
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
  .ep-form { padding: 30px 22px; border-radius: 20px; }
  .ep-photo-row { flex-direction: column; align-items: flex-start; }
}
`;

export default EditOrganizerProfile;
