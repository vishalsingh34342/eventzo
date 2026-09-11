import React, { useContext, useEffect, useState } from "react";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaLock,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import gsap from "gsap";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookingLoading, setBookingLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [error, setError] = useState("");
  const [successmsg, setSuccessMsg] = useState("");

  // ================= GET EVENT =================

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(`/events/${id}`);

        setEvent(data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Failed to load event details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // ================= PAGE ANIMATION =================

  useEffect(() => {
    if (!event) return;

    gsap.fromTo(
      ".event-detail-container",
      {
        opacity: 0,
        y: 35,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }
    );
  }, [event]);

  // ================= BOOKING =================

  const handleBooking = async () => {
    // User login check
    if (!user) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // STEP 1
      // Send OTP
      if (!showOtp) {
        await api.post("/bookings/send-otp");

        setShowOtp(true);
        setSuccessMsg(
          "OTP sent to your email. Please check your inbox."
        );

        return;
      }

      // STEP 2
      // Validate OTP
      if (!otp) {
        setError("Please enter the OTP.");
        return;
      }

      if (otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP.");
        return;
      }

      // STEP 3
      // Verify OTP + create pending booking
      const { data } = await api.post("/bookings", {
        eventId: id,
        otp,
      });

      setSuccessMsg(
        data?.message ||
          "Booking request submitted. Waiting for admin confirmation."
      );

      // Reset OTP state
      setShowOtp(false);
      setOtp("");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08070D] px-5 pb-20 pt-32 text-white md:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-[500px] rounded-[30px] bg-white/[0.04]" />
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08070D] px-5 text-center text-white">
        <div>
          <p className="text-red-400">
            {error || "Event not found"}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ================= HELPERS =================

  const formatDate = (date) => {
    if (!date) return "Date TBA";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (Number(price) === 0) {
      return "Free";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // ================= UI =================

  return (
    <div className="min-h-screen overflow-hidden bg-[#08070D] px-5 pb-20 pt-32 text-white md:px-8">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.14),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(79,70,229,0.10),transparent_30%)]" />

      <div className="event-detail-container relative z-10 mx-auto max-w-7xl">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-[#898294] transition hover:text-violet-300"
        >
          <FaArrowLeft size={12} />
          Back to events
        </button>

        {/* Main card */}
        <div className="grid overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#100E17] shadow-2xl shadow-black/20 lg:grid-cols-2">

          {/* ================= IMAGE ================= */}

          <div className="relative min-h-[400px] lg:min-h-[650px]">

            <img
              src={
                event.imageUrl ||
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80"
              }
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#08070D]/90 via-transparent to-black/10" />

            {/* Category */}

            <div className="absolute left-6 top-6">
              <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-medium text-white backdrop-blur-xl">
                {event.category || "Event"}
              </span>
            </div>

            {/* Seats */}

            <div className="absolute bottom-6 left-6">
              <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">

                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Available
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${
                    event.availableSeats > 0
                      ? "text-white"
                      : "text-red-400"
                  }`}
                >
                  {event.availableSeats > 0
                    ? `${event.availableSeats} seats`
                    : "`Sold` out"}
                </p>

              </div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}

          <div className="p-7 md:p-10 lg:p-12">

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
              Event details
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-[#F3EFF7] md:text-5xl">
              {event.title}
            </h1>

            <p className="mt-6 text-sm leading-7 text-[#858091] md:text-base">
              {event.description ||
                "Experience an unforgettable event with Eventzo."}
            </p>

            <div className="my-8 h-px bg-white/[0.07]" />

            {/* ================= DETAILS ================= */}

            <div className="space-y-5">

              {/* Date */}

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <FaCalendarAlt size={15} />
                </div>

                <div>
                  <p className="text-xs text-[#686173]">
                    Date
                  </p>

                  <p className="mt-1 text-sm text-[#D9D4E1]">
                    {formatDate(event.date)}
                  </p>
                </div>

              </div>

              {/* Location */}

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <FaMapMarkerAlt size={15} />
                </div>

                <div>
                  <p className="text-xs text-[#686173]">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-[#D9D4E1]">
                    {event.location || "Location TBA"}
                  </p>
                </div>

              </div>

              {/* Availability */}

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <FaTicketAlt size={15} />
                </div>

                <div>
                  <p className="text-xs text-[#686173]">
                    Availability
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      event.availableSeats > 0
                        ? "text-[#D9D4E1]"
                        : "text-red-400"
                    }`}
                  >
                    {event.availableSeats > 0
                      ? `${event.availableSeats} seats available`
                      : "Sold out"}
                  </p>
                </div>

              </div>

            </div>

            {/* ================= BOOKING AREA ================= */}

            <div className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

              {/* Price */}

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-[#686173]">
                    Ticket price
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-[#F0ECF5]">
                    {formatPrice(event.ticketPrice)}
                  </p>
                </div>

                {event.availableSeats <= 0 && (
                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">
                    SOLD OUT
                  </span>
                )}

              </div>

              {/* Error */}

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/15 bg-red-500/[0.08] px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Success */}

              {successmsg && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-400">
                  <FaCheckCircle className="mt-0.5 shrink-0" />
                  <span>{successmsg}</span>
                </div>
              )}

              {/* OTP */}

              {showOtp && (
                <div className="mt-5">

                  <label className="mb-2 block text-xs font-medium text-[#A7A1B0]">
                    Enter booking OTP
                  </label>

                  <div className="relative">

                    <FaLock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#635C6E]"
                      size={13}
                    />

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      maxLength={6}
                      inputMode="numeric"
                      placeholder="Enter 6-digit OTP"
                      autoFocus
                      className="h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-11 pr-4 text-sm tracking-[0.3em] text-white outline-none placeholder:tracking-normal placeholder:text-[#5F5969] focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/10"
                    />

                  </div>

                  <p className="mt-3 text-xs text-[#625C6D]">
                    OTP has been sent to your registered email.
                  </p>

                </div>
              )}

              {/* Booking button */}

              <button
                type="button"
                onClick={handleBooking}
                disabled={
                  bookingLoading ||
                  event.availableSeats <= 0
                }
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-600/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-violet-600/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {bookingLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Please wait...
                  </>
                ) : showOtp ? (
                  <>
                    Submit Booking Request
                    <FaCheckCircle size={12} />
                  </>
                ) : (
                  <>
                    Book This Event
                    <FaArrowRight size={12} />
                  </>
                )}
              </button>

              {/* Not logged in */}

              {!user && event.availableSeats > 0 && (
                <p className="mt-3 text-center text-xs text-[#625C6D]">
                  You'll need to login before booking.
                </p>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;