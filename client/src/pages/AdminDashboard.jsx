import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

import {
  CalendarDays,
  Users,
  Clock3,
  CheckCircle2,
  IndianRupee,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  MapPin,
  Ticket,
  Ban,
  Eye,
} from "lucide-react";

const emptyEvent = {
  title: "",
  description: "",
  date: "",
  location: "",
  category: "",
  totalSeats: "",
  availableSeats: "",
  ticketPrice: "",
  imageUrl: "",
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [eventForm, setEventForm] = useState(emptyEvent);

  const [bookingFilter, setBookingFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // ADMIN AUTH CHECK
  // =========================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const currentUser = parsedUser?.user || parsedUser;

      if (currentUser?.role !== "admin") {
        navigate("/");
        return;
      }

      setUser(currentUser);
    } catch (err) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // =========================
  // FETCH EVENTS + BOOKINGS
  // =========================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [eventsResponse, bookingsResponse] = await Promise.all([
        api.get("/events"),
        api.get("/bookings/all"),
      ]);

      setEvents(eventsResponse.data || []);
      setBookings(bookingsResponse.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  // =========================
  // STATS
  // =========================

  const stats = useMemo(() => {
    const totalBookings = bookings.length;

    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending"
    ).length;

    const confirmedBookings = bookings.filter(
      (booking) => booking.status === "confirmed"
    ).length;

    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled"
    ).length;

    const revenue = bookings
      .filter(
        (booking) =>
          booking.status === "confirmed" &&
          booking.paymentStatus === "paid"
      )
      .reduce(
        (sum, booking) => sum + Number(booking.amount || 0),
        0
      );

    return {
      totalEvents: events.length,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      revenue,
    };
  }, [events, bookings]);

  // =========================
  // BOOKING FILTER
  // =========================

  const filteredBookings = useMemo(() => {
    if (bookingFilter === "all") {
      return bookings;
    }

    return bookings.filter(
      (booking) => booking.status === bookingFilter
    );
  }, [bookings, bookingFilter]);

  // =========================
  // EVENT FORM
  // =========================

  const handleEventChange = (e) => {
    const { name, value } = e.target;

    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setEventForm(emptyEvent);
    setShowEventModal(true);
    setError("");
    setSuccess("");
  };

  // =========================
  // EDIT EVENT
  // =========================

  const openEditModal = (event) => {
    setEditingEvent(event);

    let formattedDate = "";

    if (event.date) {
      const d = new Date(event.date);

      formattedDate =
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}T` +
        `${String(d.getHours()).padStart(2, "0")}:` +
        `${String(d.getMinutes()).padStart(2, "0")}`;
    }

    setEventForm({
      title: event.title || "",
      description: event.description || "",
      date: formattedDate,
      location: event.location || "",
      category: event.category || "",
      totalSeats: event.totalSeats ?? "",
      availableSeats: event.availableSeats ?? "",
      ticketPrice: event.ticketPrice ?? "",
      imageUrl: event.imageUrl || "",
    });

    setShowEventModal(true);
    setError("");
    setSuccess("");
  };

  // =========================
  // CREATE / UPDATE EVENT
  // =========================

  const handleSaveEvent = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        location: eventForm.location,
        category: eventForm.category,
        totalSeats: Number(eventForm.totalSeats),
        availableSeats: Number(eventForm.availableSeats),
        ticketPrice: Number(eventForm.ticketPrice),
        imageUrl: eventForm.imageUrl,
      };

      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, payload);

        setSuccess("Event updated successfully.");
      } else {
        await api.post("/events", payload);

        setSuccess("Event created successfully.");
      }

      setShowEventModal(false);
      setEditingEvent(null);
      setEventForm(emptyEvent);

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to save event."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // DELETE EVENT
  // =========================

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await api.delete(`/events/${eventId}`);

      setSuccess("Event deleted successfully.");

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to delete event."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // APPROVE AS PAID / UNDECIDED
  // =========================

  const handleConfirmBooking = async (
    bookingId,
    paymentStatus
  ) => {
    const message =
      paymentStatus === "paid"
        ? "Approve this booking as PAID?"
        : "Approve this booking as UNDECIDED (NON PAID)?";

    const confirmed = window.confirm(message);

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await api.put(`/bookings/${bookingId}/confirm`, {
        paymentStatus,
      });

      if (paymentStatus === "paid") {
        setSuccess(
          "Booking approved as paid. Revenue updated."
        );
      } else {
        setSuccess(
          "Booking approved as non-paid."
        );
      }

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to confirm booking."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // ADMIN CANCEL / REJECT
  // =========================

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this booking?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await api.put(
        `/bookings/${bookingId}/admin-cancel`
      );

      setSuccess("Booking rejected successfully.");

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to reject booking."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08070D] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-violet-300">
          <Loader2
            className="animate-spin"
            size={24}
          />
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08070D] text-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <p className="text-violet-400 text-sm font-medium mb-2">
              EVENTZO ADMIN PANEL
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold">
              Welcome, {user?.name || "Admin"}
            </h1>

            <p className="text-white/50 mt-2">
              Manage events, bookings and payments from one place.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="
              flex items-center justify-center gap-2
              px-5 py-3
              rounded-xl
              bg-violet-600
              hover:bg-violet-500
              transition
              font-semibold
            "
          >
            <Plus size={19} />
            Create Event
          </button>
        </div>

        {/* =========================
            ALERTS
        ========================= */}

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            {success}
          </div>
        )}

        {/* =========================
            STATS
        ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={<CalendarDays size={21} />}
          />

          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<Ticket size={21} />}
          />

          <StatCard
            title="Pending"
            value={stats.pendingBookings}
            icon={<Clock3 size={21} />}
          />

          <StatCard
            title="Confirmed"
            value={stats.confirmedBookings}
            icon={<CheckCircle2 size={21} />}
          />

          <StatCard
            title="Revenue"
            value={`₹${stats.revenue.toLocaleString("en-IN")}`}
            icon={<IndianRupee size={21} />}
          />
        </div>

        {/* =========================
            EVENT MANAGEMENT
        ========================= */}

        <section className="mb-12">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold">
                Event Management
              </h2>

              <p className="text-white/40 text-sm mt-1">
                Create, update and remove your events.
              </p>
            </div>

            <span className="text-sm text-white/40">
              {events.length} events
            </span>
          </div>

          {events.length === 0 ? (
            <EmptyState text="No events available." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {events.map((event) => (
                <div
                  key={event._id}
                  className="
                    bg-[#100E17]
                    border border-white/10
                    rounded-2xl
                    overflow-hidden
                  "
                >

                  <div className="h-48 overflow-hidden bg-black/30">
                    <img
                      src={
                        event.imageUrl ||
                        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"
                      }
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <h3 className="font-semibold text-lg">
                          {event.title}
                        </h3>

                        <p className="text-violet-300 text-sm mt-1">
                          {event.category}
                        </p>
                      </div>

                      <span className="text-emerald-300 font-semibold">
                        ₹{event.ticketPrice}
                      </span>

                    </div>

                    <div className="mt-4 space-y-2 text-sm text-white/55">

                      <p className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {formatDate(event.date)}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={15} />
                        {event.location}
                      </p>

                      <p className="flex items-center gap-2">
                        <Users size={15} />
                        {event.availableSeats} /{" "}
                        {event.totalSeats} seats available
                      </p>

                    </div>

                    <div className="flex gap-2 mt-5">

                      <button
                        onClick={() =>
                          openEditModal(event)
                        }
                        className="
                          flex-1
                          flex items-center justify-center gap-2
                          py-2.5
                          rounded-lg
                          bg-white/5
                          hover:bg-white/10
                          transition
                        "
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteEvent(event._id)
                        }
                        disabled={actionLoading}
                        className="
                          flex-1
                          flex items-center justify-center gap-2
                          py-2.5
                          rounded-lg
                          bg-red-500/10
                          text-red-300
                          hover:bg-red-500/20
                          transition
                        "
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =========================
            BOOKING MANAGEMENT
        ========================= */}

        <section>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">

            <div>
              <h2 className="text-2xl font-bold">
                Booking Management
              </h2>

              <p className="text-white/40 text-sm mt-1">
                Review and manage user booking requests.
              </p>
            </div>

            {/* FILTER BUTTONS */}

            <div className="flex flex-wrap gap-2">

              {[
                "all",
                "pending",
                "confirmed",
                "cancelled",
              ].map((filter) => (
                <button
                  key={filter}
                  onClick={() =>
                    setBookingFilter(filter)
                  }
                  className={`
                    px-4 py-2
                    rounded-lg
                    text-sm
                    capitalize
                    transition
                    ${
                      bookingFilter === filter
                        ? "bg-violet-600 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }
                  `}
                >
                  {filter}
                </button>
              ))}

            </div>
          </div>

          {/* BOOKING TABLE */}

          <div className="bg-[#100E17] border border-white/10 rounded-2xl overflow-hidden">

            {filteredBookings.length === 0 ? (
              <EmptyState text="No bookings found." />
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[1200px]">

                  <thead className="border-b border-white/10 bg-white/[0.02]">

                    <tr>

                      <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-white/40">
                        User
                      </th>

                      <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-white/40">
                        Event
                      </th>

                      <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-white/40">
                        Date
                      </th>

                      <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-white/40">
                        Amount
                      </th>

                      <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-white/40">
                        Payment
                      </th>

                      <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-white/40">
                        Status
                      </th>

                      <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-white/40">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredBookings.map((booking) => (

                      <tr
                        key={booking._id}
                        className="border-b border-white/5 last:border-0"
                      >

                        {/* USER */}

                        <td className="px-5 py-4">

                          <p className="font-medium">
                            {booking.user?.name ||
                              "Unknown user"}
                          </p>

                          <p className="text-xs text-white/40 mt-1">
                            {booking.user?.email ||
                              "No email"}
                          </p>

                          <p className="text-[10px] text-white/20 mt-1">
                            ID: {booking._id}
                          </p>

                        </td>

                        {/* EVENT */}

                        <td className="px-5 py-4">

                          <p className="font-medium">
                            {booking.eventId?.title ||
                              "Deleted event"}
                          </p>

                          <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                            <MapPin size={12} />
                            {booking.eventId?.location ||
                              "N/A"}
                          </p>

                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4 text-sm text-white/60">

                          {formatDate(
                            booking.eventId?.date
                          )}

                          <div className="text-xs mt-1 text-white/35">
                            {formatTime(
                              booking.eventId?.date
                            )}
                          </div>

                        </td>

                        {/* AMOUNT */}

                        <td className="px-5 py-4 font-semibold">
                          ₹{booking.amount || 0}
                        </td>

                        {/* PAYMENT */}

                        <td className="px-5 py-4">

                          <PaymentBadge
                            status={
                              booking.paymentStatus
                            }
                          />

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <StatusBadge
                            status={booking.status}
                          />

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            {/* PENDING BOOKING */}

                            {booking.status === "pending" && (
                              <div className="flex flex-wrap gap-2">

                                {/* APPROVE AS PAID */}

                                <button
                                  onClick={() =>
                                    handleConfirmBooking(
                                      booking._id,
                                      "paid"
                                    )
                                  }
                                  disabled={actionLoading}
                                  className="
                                    flex items-center gap-1.5
                                    px-3 py-2
                                    rounded-lg
                                    bg-emerald-500/10
                                    text-emerald-300
                                    hover:bg-emerald-500/20
                                    transition
                                    text-sm
                                    font-semibold
                                    disabled:opacity-50
                                  "
                                >
                                  {actionLoading ? (
                                    <Loader2
                                      size={15}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <CheckCircle2
                                      size={15}
                                    />
                                  )}

                                  Approve as Paid
                                </button>

                                {/* APPROVE UNDECIDED */}

                                <button
                                  onClick={() =>
                                    handleConfirmBooking(
                                      booking._id,
                                      "non_paid"
                                    )
                                  }
                                  disabled={actionLoading}
                                  className="
                                    flex items-center gap-1.5
                                    px-3 py-2
                                    rounded-lg
                                    bg-white/5
                                    text-white/70
                                    hover:bg-white/10
                                    transition
                                    text-sm
                                    font-semibold
                                    disabled:opacity-50
                                  "
                                >
                                  <CheckCircle2
                                    size={15}
                                  />

                                  Approve Undecided
                                </button>

                                {/* REJECT */}

                                <button
                                  onClick={() =>
                                    handleCancelBooking(
                                      booking._id
                                    )
                                  }
                                  disabled={actionLoading}
                                  className="
                                    flex items-center gap-1.5
                                    px-3 py-2
                                    rounded-lg
                                    bg-red-500/10
                                    text-red-300
                                    hover:bg-red-500/20
                                    transition
                                    text-sm
                                    font-semibold
                                    disabled:opacity-50
                                  "
                                >
                                  <Ban size={15} />
                                  Reject
                                </button>

                              </div>
                            )}

                            {/* CONFIRMED BOOKING */}

                            {booking.status === "confirmed" && (
                              <button
                                onClick={() =>
                                  handleCancelBooking(
                                    booking._id
                                  )
                                }
                                disabled={actionLoading}
                                className="
                                  flex items-center gap-1.5
                                  px-3 py-2
                                  rounded-lg
                                  bg-red-500/10
                                  text-red-300
                                  hover:bg-red-500/20
                                  transition
                                  text-sm
                                  font-semibold
                                  disabled:opacity-50
                                "
                              >
                                <Ban size={15} />
                                Cancel
                              </button>
                            )}

                            {/* VIEW EVENT */}

                            {booking.eventId?._id && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/events/${booking.eventId._id}`
                                  )
                                }
                                className="
                                  p-2
                                  rounded-lg
                                  bg-white/5
                                  hover:bg-white/10
                                  transition
                                "
                                title="View Event"
                              >
                                <Eye size={16} />
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>

      </div>

      {/* =========================
          EVENT MODAL
      ========================= */}

      {showEventModal && (

        <div className="
          fixed inset-0
          z-50
          bg-black/70
          backdrop-blur-sm
          flex items-center justify-center
          p-4
        ">

          <div className="
            w-full max-w-3xl
            max-h-[90vh]
            overflow-y-auto
            bg-[#100E17]
            border border-white/10
            rounded-2xl
          ">

            {/* MODAL HEADER */}

            <div className="
              sticky top-0
              bg-[#100E17]
              border-b border-white/10
              px-6 py-5
              flex items-center justify-between
            ">

              <div>

                <h2 className="text-xl font-bold">
                  {editingEvent
                    ? "Edit Event"
                    : "Create Event"}
                </h2>

                <p className="text-white/40 text-sm mt-1">
                  Fill the event details below.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowEventModal(false)
                }
                className="
                  p-2
                  rounded-lg
                  hover:bg-white/10
                  transition
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSaveEvent}
              className="
                p-6
                grid grid-cols-1
                md:grid-cols-2
                gap-5
              "
            >

              <Input
                label="Title"
                name="title"
                value={eventForm.title}
                onChange={handleEventChange}
                placeholder="Event title"
                required
              />

              <Input
                label="Category"
                name="category"
                value={eventForm.category}
                onChange={handleEventChange}
                placeholder="Music, Sports..."
                required
              />

              <Input
                label="Date & Time"
                name="date"
                type="datetime-local"
                value={eventForm.date}
                onChange={handleEventChange}
                required
              />

              <Input
                label="Location"
                name="location"
                value={eventForm.location}
                onChange={handleEventChange}
                placeholder="Event location"
                required
              />

              <Input
                label="Total Seats"
                name="totalSeats"
                type="number"
                value={eventForm.totalSeats}
                onChange={handleEventChange}
                placeholder="100"
                required
              />

              <Input
                label="Available Seats"
                name="availableSeats"
                type="number"
                value={eventForm.availableSeats}
                onChange={handleEventChange}
                placeholder="100"
                required
              />

              <Input
                label="Ticket Price"
                name="ticketPrice"
                type="number"
                value={eventForm.ticketPrice}
                onChange={handleEventChange}
                placeholder="999"
                required
              />

              <Input
                label="Image URL"
                name="imageUrl"
                value={eventForm.imageUrl}
                onChange={handleEventChange}
                placeholder="https://..."
                required
              />

              <div className="md:col-span-2">

                <label className="
                  block
                  text-sm
                  text-white/60
                  mb-2
                ">
                  Description
                </label>

                <textarea
                  name="description"
                  value={eventForm.description}
                  onChange={handleEventChange}
                  rows="5"
                  required
                  placeholder="Describe the event..."
                  className="
                    w-full
                    px-4 py-3
                    rounded-xl
                    bg-black/20
                    border border-white/10
                    outline-none
                    focus:border-violet-500
                    resize-none
                  "
                />

              </div>

              <div className="
                md:col-span-2
                flex justify-end
                gap-3
                pt-3
              ">

                <button
                  type="button"
                  onClick={() =>
                    setShowEventModal(false)
                  }
                  className="
                    px-5 py-3
                    rounded-xl
                    bg-white/5
                    hover:bg-white/10
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="
                    px-5 py-3
                    rounded-xl
                    bg-violet-600
                    hover:bg-violet-500
                    transition
                    flex items-center
                    gap-2
                  "
                >

                  {actionLoading && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {editingEvent
                    ? "Update Event"
                    : "Create Event"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({ title, value, icon }) {
  return (
    <div className="
      bg-[#100E17]
      border border-white/10
      rounded-2xl
      p-5
    ">

      <div className="
        w-10 h-10
        rounded-xl
        bg-violet-500/10
        text-violet-300
        flex items-center justify-center
        mb-4
      ">
        {icon}
      </div>

      <p className="text-sm text-white/40">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-1">
        {value}
      </h3>

    </div>
  );
}

/* =========================
   STATUS BADGE
========================= */

function StatusBadge({ status }) {
  const styles = {
    pending:
      "bg-amber-500/10 text-amber-300",

    confirmed:
      "bg-emerald-500/10 text-emerald-300",

    cancelled:
      "bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`
        inline-flex
        px-3 py-1
        rounded-full
        text-xs
        capitalize
        ${
          styles[status] ||
          "bg-white/10 text-white/60"
        }
      `}
    >
      {status || "unknown"}
    </span>
  );
}

/* =========================
   PAYMENT BADGE
========================= */

function PaymentBadge({ status }) {
  const styles = {
    paid:
      "bg-emerald-500/10 text-emerald-300",

    non_paid:
      "bg-amber-500/10 text-amber-300",

    failed:
      "bg-red-500/10 text-red-300",
  };

  return (
    <span
      className={`
        inline-flex
        px-3 py-1
        rounded-full
        text-xs
        ${
          styles[status] ||
          "bg-white/10 text-white/60"
        }
      `}
    >
      {status === "non_paid"
        ? "Non Paid"
        : status || "Unknown"}
    </span>
  );
}

/* =========================
   INPUT
========================= */

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div>

      <label className="
        block
        text-sm
        text-white/60
        mb-2
      ">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          w-full
          px-4 py-3
          rounded-xl
          bg-black/20
          border border-white/10
          outline-none
          focus:border-violet-500
          transition
        "
      />

    </div>
  );
}

/* =========================
   EMPTY STATE
========================= */

function EmptyState({ text }) {
  return (
    <div className="
      py-16
      text-center
      text-white/40
    ">
      {text}
    </div>
  );
}

export default AdminDashboard;