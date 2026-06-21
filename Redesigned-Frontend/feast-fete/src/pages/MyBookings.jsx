import { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Calendar,
  UtensilsCrossed,
  Users,
  Wallet,
  CreditCard,
  CheckCircle,
  Download,
  XCircle,
  PackageCheck,
} from "lucide-react";



const MyBookings = () => {
  const API3 = import.meta.env.VITE_BOOKING_URL;
  const API4 = import.meta.env.VITE_PAYMENT_URL;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  const customerEmail = localStorage.getItem("email");

  const handleCompleteBooking = async (bookingId) => {
    setCompletingId(bookingId);
    try {
      await fetch(`${API3}/api/booking/complete/${bookingId}`, {
        method: "PUT",
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, bookingStatus: "COMPLETED" }
            : booking
        )
      );
    } catch (error) {
      console.log(error);
      alert("Failed to Complete Booking");
    } finally {
      setCompletingId(null);
    }
  };

  const handleAdvancePayment = async (booking) => {
    setPayingId(booking.id);
    try {
      const response = await axios.post(
        `${API4}/api/payment/create-order`,
        {
          bookingId: booking.id,
          customerEmail: booking.customerEmail,
          amount: booking.advanceAmount,
          paymentType: "ADVANCE",
        }
      );

      const data = response.data;

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Feast & Fete",
        description: "Advance Payment",
        order_id: data.orderId,

        handler: async function () {
          await fetch(
            `${API3}/api/booking/advance-paid/${booking.id}`,
            { method: "PUT" }
          );

          alert("Payment Successful");
          window.location.reload();
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      alert("Payment Failed");
    } finally {
      setPayingId(null);
    }
  };

  const downloadInvoice = (bookingId) => {
    window.open(`${API3}/api/booking/invoice/${bookingId}`, "_blank");
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await fetch(`${API3}/api/booking/cancel/${bookingId}`, {
        method: "PUT",
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, bookingStatus: "CANCELLED" }
            : booking
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch(`${API3}/api/booking/customer/${customerEmail}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Unable to load bookings");
        setLoading(false);
      });
  }, [customerEmail]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setMounted(true), 30);
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <div className="mb-root">
      <style>{CSS}</style>

      {loading && <SkeletonScreen />}

      {!loading && error && <ErrorScreen error={error} />}

      {!loading && !error && bookings.length === 0 && <EmptyScreen />}

      {!loading && !error && bookings.length > 0 && (
        <div className="mb-page">
          {/* TITLE */}
          <div className="mb-title-row mb-fade" style={{ "--d": "0.05s" }}>
            <h1 className="mb-title">My Bookings</h1>
            <p className="mb-subtitle">Your Catering Booking History</p>
          </div>

          {/* BOOKINGS */}
          <div className="mb-grid">
            {bookings.map((booking, i) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const eventDate = new Date(booking.eventDate);
              eventDate.setHours(0, 0, 0, 0);

              const eventCompleted = eventDate <= today;

              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  index={i}
                  mounted={mounted}
                  eventCompleted={eventCompleted}
                  onPay={handleAdvancePayment}
                  onDownload={downloadInvoice}
                  onComplete={handleCompleteBooking}
                  onCancel={handleCancelBooking}
                  paying={payingId === booking.id}
                  completing={completingId === booking.id}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ----------------------------- Card -------------------------------- */

const statusMap = {
  CONFIRMED: { bg: "#e2f5e7", fg: "#16a34a", dot: "#16a34a" },
  COMPLETED: { bg: "#dff1f6", fg: "#0c5460", dot: "#0c5460" },
  CANCELLED: { bg: "#fdeceb", fg: "#c0392b", dot: "#c0392b" },
  PENDING: { bg: "#fff6dd", fg: "#856404", dot: "#d4a017" },
};

const BookingCard = ({
  booking,
  index,
  mounted,
  eventCompleted,
  onPay,
  onDownload,
  onComplete,
  onCancel,
  paying,
  completing,
}) => {
  const status =
    statusMap[booking.bookingStatus] || statusMap.PENDING;

  const rows = [
    [Calendar, "Event Date", booking.eventDate],
    [UtensilsCrossed, "Meal Type", booking.mealType],
    [Users, "Guests", booking.guestCount],
    [Wallet, "Total", `₹ ${booking.totalAmount}`],
    [CreditCard, "Advance", `₹ ${booking.advanceAmount}`],
  ];

  return (
    <div
      className={`mb-card ${mounted ? "mb-card-in" : "mb-card-pre"}`}
      style={{ "--d": `${0.1 + index * 0.08}s` }}
    >
      <div className="mb-card-left">
        <div className="mb-card-header">
          <span className="mb-icon-badge">
            <Mail size={18} />
          </span>
          <h3 className="mb-org-email">{booking.organizerEmail}</h3>
        </div>

        <div className="mb-detail-grid">
          {rows.map(([Icon, label, value], i) => (
            <div
              className="mb-detail-row"
              key={label}
              style={{ "--rd": `${0.05 * i}s` }}
            >
              <Icon size={18} className="mb-detail-icon" />
              <span className="mb-detail-label">{label}</span>
              <span className="mb-detail-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-card-right">
        <span
          className="mb-status-badge"
          style={{
            background: status.bg,
            color: status.fg,
          }}
        >
          <span
            className="mb-status-dot"
            style={{ background: status.dot }}
          />
          {booking.bookingStatus}
        </span>

        {booking.bookingStatus === "CONFIRMED" && !booking.advancePaid && (
          <button
            className="mb-btn mb-btn-pay"
            onClick={() => onPay(booking)}
            disabled={paying}
          >
            {paying ? (
              <span className="mb-btn-loading">
                <span className="mb-spinner" />
                Processing…
              </span>
            ) : (
              `Pay Advance ₹ ${booking.advanceAmount}`
            )}
          </button>
        )}

        {booking.bookingStatus === "CONFIRMED" && booking.advancePaid && (
          <>
            <span className="mb-paid-tag">
              <CheckCircle size={18} />
              Advance Paid
            </span>

            <button
              className="mb-btn mb-btn-invoice"
              onClick={() => onDownload(booking.id)}
            >
              <Download size={16} />
              Download Invoice
            </button>

            {eventCompleted && (
              <button
                className="mb-btn mb-btn-complete"
                onClick={() => onComplete(booking.id)}
                disabled={completing}
              >
                {completing ? (
                  <span className="mb-btn-loading">
                    <span className="mb-spinner" />
                    Updating…
                  </span>
                ) : (
                  <>
                    <PackageCheck size={16} />
                    Mark Completed
                  </>
                )}
              </button>
            )}

            <button
              className="mb-btn mb-btn-cancel"
              onClick={() => onCancel(booking.id)}
            >
              <XCircle size={16} />
              Cancel Booking
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ---------------------------- Skeleton ------------------------------ */

const SkeletonScreen = () => (
  <div className="mb-page">
    <div className="mb-skel-title shimmer" />
    <div className="mb-skel-sub shimmer" />

    <div className="mb-grid">
      {[...Array(3)].map((_, i) => (
        <div className="mb-card mb-skel-card" key={i}>
          <div className="mb-card-left" style={{ width: "100%" }}>
            <div className="mb-skel-line w50 shimmer" />
            {[...Array(4)].map((_, j) => (
              <div className="mb-skel-line w90 shimmer" key={j} />
            ))}
          </div>
          <div className="mb-skel-badge shimmer" />
        </div>
      ))}
    </div>
  </div>
);

/* ----------------------------- States -------------------------------- */

const ErrorScreen = ({ error }) => (
  <div className="mb-center">
    <div className="mb-state-box mb-pop-in">
      <div className="mb-state-icon mb-state-icon-error">!</div>
      <h2 className="mb-state-title mb-state-title-error">{error}</h2>
      <p className="mb-state-sub">
        Please refresh the page or try again shortly.
      </p>
    </div>
  </div>
);

const EmptyScreen = () => (
  <div className="mb-center">
    <div className="mb-state-box mb-pop-in">
      <div className="mb-state-icon mb-state-icon-empty">
        <Calendar size={30} />
      </div>
      <h2 className="mb-state-title">No Bookings Found</h2>
      <p className="mb-state-sub">
        Your catering bookings will appear here once you make one.
      </p>
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
  --accent: #8B5E00;
  --accent-soft: #fdf3e2;
  --border: #ece3d4;
  --shadow: 0 15px 40px rgba(0,0,0,0.08);
  --shadow-hover: 0 22px 50px rgba(43,20,8,0.14);
}

.mb-root * { box-sizing: border-box; }
.mb-root { font-family: 'Inter', system-ui, sans-serif; color: var(--ink); }

.mb-page { min-height: 100vh; background: var(--cream); padding: 50px 8%; }
.mb-center {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--cream);
  padding: 40px;
}

.mb-fade {
  opacity: 0;
  transform: translateY(12px);
  animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

.mb-title-row { margin-bottom: 40px; }
.mb-title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(34px, 5vw, 52px);
  color: var(--ink);
  letter-spacing: -0.01em;
}
.mb-subtitle { color: var(--ink-soft); margin-top: 10px; font-size: 16px; }

/* ----- Grid + Card ----- */
.mb-grid { display: grid; gap: 28px; }

.mb-card {
  background: var(--surface);
  border-radius: 28px;
  padding: 40px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.mb-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-3px);
}
.mb-card-pre { opacity: 0; transform: translateY(24px); }
.mb-card-in {
  animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d, 0s);
}
@keyframes cardIn {
  to { opacity: 1; transform: translateY(0); }
}

.mb-card-left { flex: 1; min-width: 260px; }

.mb-card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}
.mb-icon-badge {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.mb-org-email { font-size: 19px; font-weight: 600; }

.mb-detail-grid { display: grid; gap: 16px; }
.mb-detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  padding: 6px 8px;
  border-radius: 10px;
  opacity: 0;
  transform: translateX(-6px);
  animation: rowIn 0.4s ease forwards;
  animation-delay: var(--rd, 0s);
  transition: background 0.2s ease;
}
.mb-card-in .mb-detail-row { animation-delay: calc(var(--d) + var(--rd) + 0.15s); }
@keyframes rowIn { to { opacity: 1; transform: translateX(0); } }
.mb-detail-row:hover { background: var(--cream); }
.mb-detail-icon { color: var(--accent); flex-shrink: 0; }
.mb-detail-label { color: var(--ink-soft); min-width: 110px; font-weight: 500; }
.mb-detail-value { font-weight: 600; }

/* ----- Right column ----- */
.mb-card-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: stretch;
  min-width: 220px;
}

.mb-status-badge {
  padding: 13px 24px;
  border-radius: 18px;
  font-weight: 700;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  animation: badgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}
@keyframes badgePop {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
.mb-status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  animation: dotPulse 2s ease-in-out infinite;
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
  50%      { opacity: 0.6; }
}

.mb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 14px;
  padding: 14px 22px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.mb-btn:active { transform: scale(0.96); }
.mb-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.mb-btn-pay {
  background: linear-gradient(90deg, #16a34a, #22c55e);
  color: #fff;
  font-size: 17px;
  padding: 15px 26px;
  position: relative;
  overflow: hidden;
}
.mb-btn-pay::after {
  content: '';
  position: absolute;
  top: 0; left: -150%;
  width: 50%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
  animation: payShine 2.6s ease-in-out infinite;
}
@keyframes payShine {
  0%   { left: -150%; }
  60%  { left: 150%; }
  100% { left: 150%; }
}
.mb-btn-pay:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(22,163,74,0.35);
}

.mb-btn-invoice {
  background: #7c3aed;
  color: #fff;
}
.mb-btn-invoice:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(124,58,237,0.3);
  filter: brightness(1.07);
}

.mb-btn-complete {
  background: var(--ink);
  color: #fff;
}
.mb-btn-complete:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(43,20,8,0.3);
  filter: brightness(1.1);
}

.mb-btn-cancel {
  background: #fdeceb;
  color: #c0392b;
}
.mb-btn-cancel:hover {
  background: #fbdbd8;
  transform: translateY(-2px);
}

.mb-btn-loading { display: inline-flex; align-items: center; gap: 9px; }
.mb-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.mb-paid-tag {
  color: #16a34a;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  animation: fadeUp 0.4s ease;
}

/* ----- Skeleton ----- */
.mb-skel-title { width: 320px; height: 50px; border-radius: 10px; }
.mb-skel-sub { width: 220px; height: 18px; border-radius: 8px; margin-top: 14px; margin-bottom: 40px; }
.mb-skel-card { align-items: flex-start; }
.mb-skel-line { height: 18px; border-radius: 8px; margin-top: 14px; }
.mb-skel-badge { width: 140px; height: 46px; border-radius: 18px; }
.w50 { width: 50%; }
.w90 { width: 95%; }

.shimmer {
  background: linear-gradient(90deg, #ece3d4 25%, #f6f0e6 37%, #ece3d4 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* ----- Error / empty states ----- */
.mb-state-box {
  text-align: center;
  background: var(--surface);
  padding: 56px 48px;
  border-radius: 24px;
  box-shadow: var(--shadow);
  max-width: 420px;
  border: 1px solid var(--border);
}
.mb-pop-in { animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.mb-state-icon {
  width: 60px; height: 60px;
  margin: 0 auto 22px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px;
  font-weight: 700;
}
.mb-state-icon-error {
  background: #fdecea;
  color: #c0392b;
  animation: shake 0.5s ease 0.3s;
}
.mb-state-icon-empty {
  background: var(--accent-soft);
  color: var(--accent);
  animation: glowPulse 2.6s ease-in-out infinite;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
@keyframes glowPulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.08); }
}
.mb-state-title {
  font-family: 'Fraunces', serif;
  font-size: 24px;
  color: var(--ink);
}
.mb-state-title-error { color: #c0392b; }
.mb-state-sub { color: var(--ink-soft); margin-top: 10px; font-size: 15px; }

/* ----- Reduced motion ----- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

/* ----- Responsive ----- */
@media (max-width: 768px) {
  .mb-page { padding: 36px 5%; }
  .mb-card { flex-direction: column; align-items: stretch; padding: 28px; }
  .mb-card-right { width: 100%; }
}
`;

export default MyBookings;
