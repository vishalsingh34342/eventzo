import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

import {
  FaTicketAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaClock,
  FaSearch,
} from "react-icons/fa";

import gsap from "gsap";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageRef = useRef(null);

  const currentUser = user?.user || user;

  // ================= FETCH BOOKINGS =================

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/bookings/my");

        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  // ================= PAGE ANIMATION =================

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        pageRef.current,
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".dashboard-stat",
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.15,
          ease: "power3.out",
        }
      );
    }
  }, [loading]);

  // ================= STATS =================

  const stats = useMemo(() => {
    const pending = bookings.filter(
      (booking) => booking.status === "pending"
    ).length;

    const confirmed = bookings.filter(
      (booking) => booking.status === "confirmed"
    ).length;

    return {
      total: bookings.length,
      pending,
      confirmed,
    };
  }, [bookings]);

  // ================= UPCOMING EVENT =================

  const upcomingBooking = useMemo(() => {
    const now = new Date();

    return bookings
      .filter((booking) => {
        const eventDate = booking.eventId?.date;

        return (
          booking.status === "confirmed" &&
          eventDate &&
          new Date(eventDate) >= now
        );
      })
      .sort(
        (a, b) =>
          new Date(a.eventId.date) -
          new Date(b.eventId.date)
      )[0];
  }, [bookings]);

  // ================= RECENT BOOKINGS =================

  const recentBookings = useMemo(() => {
    return [...bookings].slice(0, 4);
  }, [bookings]);

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
    if (Number(price) === 0) {
      return "Free";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: <FaHourglassHalf />,
      classes:
        "border-amber-500/20 bg-amber-500/10 text-amber-400",
    },

    confirmed: {
      label: "Confirmed",
      icon: <FaCheckCircle />,
      classes:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    },

    cancelled: {
      label: "Cancelled",
      icon: <FaClock />,
      classes:
        "border-red-500/20 bg-red-500/10 text-red-400",
    },
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08070D] px-5 pb-20 pt-32 text-white md:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-10 w-72 rounded-xl bg-white/[0.05]" />

          <div className="mt-3 h-5 w-96 max-w-full rounded-lg bg-white/[0.04]" />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 rounded-2xl bg-white/[0.04]"
              />
            ))}
          </div>

          <div className="mt-8 h-80 rounded-[28px] bg-white/[0.04]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#08070D] px-5 pb-20 pt-32 text-white md:px-8">

      {/* Background */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(124,58,237,0.12),transparent_30%),radial-gradient(circle_at_90%_70%,rgba(79,70,229,0.10),transparent_30%)]" />

      <div
        ref={pageRef}
        className="relative z-10 mx-auto max-w-7xl"
      >

        {/* ================= HEADER ================= */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
              Dashboard
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#F2EEF7] md:text-5xl">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-violet-300 to-indigo-400 bg-clip-text text-transparent">
                {currentUser?.name || "there"}
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7E7789] md:text-base">
              Keep track of your bookings and stay ready for your next
              Eventzo experience.
            </p>
          </div>

          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-sm font-medium text-[#B7B1BF] transition-all duration-300 hover:border-violet-500/20 hover:bg-violet-500/10 hover:text-violet-300"
          >
            <FaSearch size={12} />
            Explore Events

            <FaArrowRight
              size={10}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/15 bg-red-500/[0.07] px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ================= STATS ================= */}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total */}

          <div className="dashboard-stat rounded-2xl border border-white/[0.07] bg-[#100E17] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/20">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-[#666072]">
                  Total bookings
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#EEEAF3]">
                  {stats.total}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <FaTicketAlt size={17} />
              </div>
            </div>
          </div>

          {/* Pending */}

          <div className="dashboard-stat rounded-2xl border border-white/[0.07] bg-[#100E17] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/20">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-[#666072]">
                  Pending requests
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#EEEAF3]">
                  {stats.pending}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <FaHourglassHalf size={17} />
              </div>
            </div>
          </div>

          {/* Confirmed */}

          <div className="dashboard-stat rounded-2xl border border-white/[0.07] bg-[#100E17] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-[#666072]">
                  Confirmed bookings
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#EEEAF3]">
                  {stats.confirmed}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <FaCheckCircle size={17} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= UPCOMING EVENT ================= */}

        {upcomingBooking && (
          <section className="mt-8">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
                  Up next
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[#EBE7F0]">
                  Your next event
                </h2>
              </div>
            </div>

            <div className="grid overflow-hidden rounded-[28px] border border-violet-500/15 bg-[#100E17] lg:grid-cols-[0.9fr_1.1fr]">

              {/* Image */}

              <div className="relative min-h-[300px]">

                <img
                  src={
                    upcomingBooking.eventId?.imageUrl ||
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={upcomingBooking.eventId?.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                <div className="absolute left-5 top-5">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-xl">
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Details */}

              <div className="p-7 md:p-9">

                <p className="text-xs text-[#6D6678]">
                  {upcomingBooking.eventId?.category || "Event"}
                </p>

                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-[#F1EDF5]">
                  {upcomingBooking.eventId?.title}
                </h3>

                <div className="mt-7 space-y-4">

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <FaCalendarAlt size={13} />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#625C6D]">
                        Date
                      </p>

                      <p className="mt-1 text-sm text-[#D4CFDA]">
                        {formatDate(upcomingBooking.eventId?.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <FaClock size={13} />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#625C6D]">
                        Time
                      </p>

                      <p className="mt-1 text-sm text-[#D4CFDA]">
                        {formatTime(upcomingBooking.eventId?.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <FaMapMarkerAlt size={13} />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#625C6D]">
                        Location
                      </p>

                      <p className="mt-1 text-sm text-[#D4CFDA]">
                        {upcomingBooking.eventId?.location || "TBA"}
                      </p>
                    </div>
                  </div>

                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-6">

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#625C6D]">
                      Ticket
                    </p>

                    <p className="mt-1 text-lg font-semibold text-[#EEEAF2]">
                      {formatPrice(upcomingBooking.amount)}
                    </p>
                  </div>

                  <Link
                    to={`/events/${upcomingBooking.eventId?._id}`}
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5"
                  >
                    View Event
                    <FaArrowRight
                      size={10}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= RECENT BOOKINGS ================= */}

        <section className="mt-10">

          <div className="mb-5 flex items-end justify-between">

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
                Activity
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#EBE7F0]">
                Recent bookings
              </h2>
            </div>

            <Link
              to="/my-bookings"
              className="hidden items-center gap-2 text-sm text-[#9E97A9] transition hover:text-violet-300 sm:flex"
            >
              View all
              <FaArrowRight size={10} />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.02] px-6 py-16 text-center">

              <FaTicketAlt className="mx-auto text-violet-400" size={25} />

              <p className="mt-4 text-base font-medium text-[#DCD7E4]">
                No bookings yet
              </p>

              <p className="mt-2 text-sm text-[#746E7D]">
                Start exploring events and create your first booking.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">

              {recentBookings.map((booking) => {

                const status =
                  statusConfig[booking.status] ||
                  statusConfig.pending;

                return (
                  <div
                    key={booking._id}
                    className="
                      flex flex-col
                      gap-5
                      rounded-2xl
                      border border-white/[0.07]
                      bg-[#100E17]
                      p-5
                      transition-all duration-300
                      hover:border-violet-500/15
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >

                    {/* Left */}

                    <div className="flex min-w-0 items-center gap-4">

                      <img
                        src={
                          booking.eventId?.imageUrl ||
                          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=300&q=80"
                        }
                        alt={booking.eventId?.title}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-semibold text-[#E9E5EE]">
                          {booking.eventId?.title || "Event"}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#777080]">

                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-violet-400" />
                            {formatDate(booking.eventId?.date)}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <FaMapMarkerAlt className="text-violet-400" />
                            {booking.eventId?.location || "TBA"}
                          </span>

                        </div>
                      </div>
                    </div>

                    {/* Right */}

                    <div className="flex items-center justify-between gap-4 sm:justify-end">

                      <div className="text-left sm:text-right">

                        <span
                          className={`
                            inline-flex
                            items-center gap-2
                            rounded-full
                            border
                            px-3 py-1.5
                            text-xs font-medium
                            ${status.classes}
                          `}
                        >
                          {status.icon}
                          {status.label}
                        </span>

                        <p className="mt-2 text-sm font-semibold text-[#DCD7E4]">
                          {formatPrice(booking.amount)}
                        </p>
                      </div>

                      <Link
                        to="/my-bookings"
                        className="
                          flex h-9 w-9
                          shrink-0
                          items-center justify-center
                          rounded-lg
                          border border-white/[0.08]
                          bg-white/[0.02]
                          text-[#898293]
                          transition
                          hover:border-violet-500/20
                          hover:bg-violet-500/10
                          hover:text-violet-300
                        "
                      >
                        <FaArrowRight size={11} />
                      </Link>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link
            to="/my-bookings"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-3 text-sm font-medium text-[#9E97A9] transition hover:border-violet-500/20 hover:bg-violet-500/10 hover:text-violet-300 sm:hidden"
          >
            View all bookings
            <FaArrowRight size={10} />
          </Link>
        </section>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="mt-10 grid gap-5 md:grid-cols-2">

          <Link
            to="/"
            className="
              group rounded-2xl
              border border-white/[0.07]
              bg-white/[0.02]
              p-6
              transition-all duration-300
              hover:-translate-y-1
              hover:border-violet-500/20
              hover:bg-violet-500/[0.05]
            "
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-[#E7E2ED]">
                  Discover more events
                </p>

                <p className="mt-2 text-xs leading-5 text-[#716A7B]">
                  Find concerts, conferences, sports and more.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition group-hover:scale-110">
                <FaSearch size={15} />
              </div>

            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-violet-400">
              Explore now
              <FaArrowRight
                size={9}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

          <Link
            to="/my-bookings"
            className="
              group rounded-2xl
              border border-white/[0.07]
              bg-white/[0.02]
              p-6
              transition-all duration-300
              hover:-translate-y-1
              hover:border-violet-500/20
              hover:bg-violet-500/[0.05]
            "
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold text-[#E7E2ED]">
                  Manage your bookings
                </p>

                <p className="mt-2 text-xs leading-5 text-[#716A7B]">
                  Check status, details and manage your requests.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition group-hover:scale-110">
                <FaTicketAlt size={15} />
              </div>

            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-violet-400">
              View bookings
              <FaArrowRight
                size={9}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

        </section>
      </div>
    </div>
  );
};

export default UserDashboard;