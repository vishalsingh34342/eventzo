import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaClock,
  FaTimes,
  FaCheckCircle,
  FaHourglassHalf,
  FaArrowRight,
  FaChevronLeft,
} from "react-icons/fa";

import gsap from "gsap";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= FETCH BOOKINGS =================

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/bookings/my");

        setBookings(data);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
      navigate("/login");
    }
  }, [user, navigate]);

  // ================= ANIMATION =================

  useEffect(() => {
    if (!loading && bookings.length > 0) {
      gsap.fromTo(
        ".booking-card",
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }
  }, [loading, bookings]);

  // ================= CANCEL =================

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancelLoading(bookingId);
      setError("");
      setSuccess("");

      await api.delete(`/bookings/${bookingId}`);

      // Remove cancelled booking from list
      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );

      setSuccess("Booking cancelled successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to cancel booking."
      );
    } finally {
      setCancelLoading(null);
    }
  };

  // ================= HELPERS =================

  const formatDate = (date) => {
    if (!date) return "Date TBA";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "Time TBA";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    if (Number(price) === 0) return "Free";

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          label: "Confirmed",
          icon: <FaCheckCircle />,
          classes:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        };

      case "pending":
        return {
          label: "Pending",
          icon: <FaHourglassHalf />,
          classes:
            "border-amber-500/20 bg-amber-500/10 text-amber-400",
        };

      case "cancelled":
        return {
          label: "Cancelled",
          icon: <FaTimes />,
          classes:
            "border-red-500/20 bg-red-500/10 text-red-400",
        };

      default:
        return {
          label: status || "Unknown",
          icon: <FaClock />,
          classes:
            "border-white/10 bg-white/[0.04] text-gray-400",
        };
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08070D] px-5 pb-20 pt-32 text-white md:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="mb-10 h-10 w-56 rounded-xl bg-white/[0.05]" />

          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[430px] rounded-[28px] bg-white/[0.04]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="min-h-screen overflow-hidden bg-[#08070D] px-5 pb-20 pt-32 text-white md:px-8">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(124,58,237,0.12),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(79,70,229,0.10),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-10">

          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm text-[#817A8D] transition hover:text-violet-300"
          >
            <FaChevronLeft size={10} />
            Back
          </button>

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
            Your activity
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#F2EEF7] md:text-5xl">
                My Bookings
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#7E7789] md:text-base">
                Manage your event requests, confirmed bookings,
                and upcoming experiences.
              </p>
            </div>

            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[#AAA4B5] transition hover:text-violet-300"
            >
              Explore events
              <FaArrowRight
                size={11}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* ================= MESSAGES ================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/15 bg-red-500/[0.07] px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.07] px-5 py-4 text-sm text-emerald-400">
            <FaCheckCircle />
            {success}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {bookings.length === 0 ? (
          <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.025] px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <FaTicketAlt size={23} />
            </div>

            <h2 className="mt-6 text-xl font-semibold text-[#EDE9F2]">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777080]">
              You haven't booked any events yet. Explore Eventzo
              and find something worth experiencing.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20"
            >
              Explore events
              <FaArrowRight size={11} />
            </Link>

          </div>
        ) : (

          /* ================= BOOKINGS ================= */

          <div className="grid gap-6 lg:grid-cols-2">

            {bookings.map((booking) => {
              const event = booking.eventId;
              const status = getStatusConfig(booking.status);

              return (
                <article
                  key={booking._id}
                  className="
                    booking-card
                    group overflow-hidden
                    rounded-[28px]
                    border border-white/[0.07]
                    bg-[#100E17]
                    shadow-2xl shadow-black/10
                    transition-all duration-500
                    hover:-translate-y-1
                    hover:border-violet-500/20
                    hover:shadow-violet-950/10
                  "
                >

                  {/* ================= EVENT IMAGE ================= */}

                  <div className="relative h-56 overflow-hidden">

                    <img
                      src={
                        event?.imageUrl ||
                        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={event?.title || "Event"}
                      className="
                        h-full w-full object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-105
                      "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#100E17] via-transparent to-black/10" />

                    {/* Status */}

                    <div className="absolute left-4 top-4">
                      <span
                        className={`
                          inline-flex items-center gap-2
                          rounded-full
                          border
                          px-3 py-1.5
                          text-xs font-medium
                          backdrop-blur-xl
                          ${status.classes}
                        `}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </div>

                    {/* Booking ID */}

                    <div className="absolute bottom-4 right-4">
                      <span className="rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-[10px] text-gray-300 backdrop-blur-xl">
                        #{booking._id?.slice(-8)}
                      </span>
                    </div>
                  </div>

                  {/* ================= CONTENT ================= */}

                  <div className="p-6">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h2 className="text-xl font-semibold text-[#ECE8F2]">
                          {event?.title || "Event"}
                        </h2>

                        <p className="mt-2 text-sm text-[#777080]">
                          {event?.category || "Event"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-[#625C6D]">
                          Amount
                        </p>

                        <p className="mt-1 text-lg font-semibold text-[#ECE8F0]">
                          {formatPrice(booking.amount)}
                        </p>
                      </div>
                    </div>

                    {/* Details */}

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">

                      {/* Date */}

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                          <FaCalendarAlt size={13} />
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#625C6D]">
                            Date
                          </p>

                          <p className="mt-1 text-sm text-[#D4CFDA]">
                            {formatDate(event?.date)}
                          </p>
                        </div>

                      </div>

                      {/* Time */}

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                          <FaClock size={13} />
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#625C6D]">
                            Time
                          </p>

                          <p className="mt-1 text-sm text-[#D4CFDA]">
                            {formatTime(event?.date)}
                          </p>
                        </div>

                      </div>

                      {/* Location */}

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                          <FaMapMarkerAlt size={13} />
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#625C6D]">
                            Location
                          </p>

                          <p className="mt-1 line-clamp-1 text-sm text-[#D4CFDA]">
                            {event?.location || "Location TBA"}
                          </p>
                        </div>

                      </div>

                      {/* Payment */}

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                          <FaTicketAlt size={13} />
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#625C6D]">
                            Payment
                          </p>

                          <p
                            className={`mt-1 text-sm ${
                              booking.paymentStatus === "paid"
                                ? "text-emerald-400"
                                : "text-[#D4CFDA]"
                            }`}
                          >
                            {booking.paymentStatus === "paid"
                              ? "Paid"
                              : "Not paid"}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* ================= ACTIONS ================= */}

                    <div className="mt-7 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row">

                      {event?._id && (
                        <Link
                          to={`/events/${event._id}`}
                          className="
                            group flex flex-1
                            items-center justify-center gap-2
                            rounded-xl
                            border border-white/[0.08]
                            bg-white/[0.025]
                            px-4 py-3
                            text-sm font-medium
                            text-[#B9B3C1]
                            transition-all duration-300
                            hover:border-violet-500/20
                            hover:bg-violet-500/10
                            hover:text-violet-300
                          "
                        >
                          View event
                          <FaArrowRight
                            size={10}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      )}

                      <button
                        onClick={() =>
                          handleCancel(booking._id)
                        }
                        disabled={cancelLoading === booking._id}
                        className="
                          flex flex-1
                          items-center justify-center gap-2
                          rounded-xl
                          border border-red-500/15
                          bg-red-500/[0.06]
                          px-4 py-3
                          text-sm font-medium
                          text-red-400
                          transition-all duration-300
                          hover:bg-red-500/10
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {cancelLoading === booking._id ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-400/30 border-t-red-400" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <FaTimes size={11} />
                            Cancel Booking
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;