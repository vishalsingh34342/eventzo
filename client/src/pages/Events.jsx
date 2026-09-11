import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaTicketAlt,
} from "react-icons/fa";

import api from "../utils/axios";

const categories = [
  "All",
  "Technology",
  "Music",
  "Business",
  "Sports",
  "Entertainment",
];

const Events = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH ALL EVENTS
  // =========================

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/events");

        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // =========================
  // FILTER EVENTS
  // =========================

  const filteredEvents = events.filter((event) => {
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      event.title?.toLowerCase().includes(searchValue) ||
      event.location?.toLowerCase().includes(searchValue) ||
      event.category?.toLowerCase().includes(searchValue);

    const matchesCategory =
      activeCategory === "All" ||
      event.category?.toLowerCase() ===
        activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "Date TBA";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "Free";
    }

    if (Number(price) === 0) {
      return "Free";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-[#08070D] text-white pt-28">

      {/* =========================
          HEADER
      ========================= */}

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-12">

        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
            Discover
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#F4F1FA] sm:text-5xl md:text-6xl">
            Explore all events
          </h1>

          <p className="mt-4 text-base leading-7 text-[#8D8798]">
            Find concerts, conferences, sports, business events
            and unforgettable experiences.
          </p>
        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div
          className="
            mt-8
            flex max-w-3xl
            items-center
            rounded-2xl
            border border-white/[0.08]
            bg-white/[0.035]
            p-2
            backdrop-blur-xl
          "
        >
          <div className="relative flex-1">
            <FaSearch
              className="
                absolute left-4 top-1/2
                -translate-y-1/2
                text-[#746D84]
              "
              size={15}
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search events, cities or categories..."
              className="
                h-14 w-full
                rounded-xl
                border border-white/[0.05]
                bg-[#0E0D15]
                pl-11 pr-4
                text-sm text-white
                outline-none
                placeholder:text-[#625D6C]
                focus:border-violet-500/40
                focus:ring-2
                focus:ring-violet-500/10
              "
            />
          </div>
        </div>
      </section>

      {/* =========================
          EVENT SECTION
      ========================= */}

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">

        {/* CATEGORIES */}

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setActiveCategory(category)
              }
              className={`
                whitespace-nowrap
                rounded-full
                border
                px-4 py-2
                text-xs
                font-medium
                transition-all duration-300
                ${
                  activeCategory === category
                    ? "border-violet-500/30 bg-violet-500/15 text-violet-300"
                    : "border-white/[0.08] bg-white/[0.025] text-[#8D8798] hover:border-violet-500/20 hover:text-violet-300"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* =========================
            RESULTS COUNT
        ========================= */}

        <div className="mb-6">
          <p className="text-sm text-[#746E7E]">
            Showing{" "}
            <span className="text-white">
              {filteredEvents.length}
            </span>{" "}
            event
            {filteredEvents.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="
                  h-[430px]
                  animate-pulse
                  rounded-3xl
                  border border-white/[0.06]
                  bg-white/[0.025]
                "
              />
            ))}

          </div>
        ) : filteredEvents.length === 0 ? (

          /* =========================
             EMPTY
          ========================= */

          <div
            className="
              rounded-3xl
              border border-white/[0.07]
              bg-white/[0.02]
              px-6 py-24
              text-center
            "
          >
            <p className="text-lg font-medium text-[#D8D3E0]">
              No events found
            </p>

            <p className="mt-2 text-sm text-[#746E7E]">
              Try another search or category.
            </p>
          </div>

        ) : (

          /* =========================
             EVENT CARDS
          ========================= */

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredEvents.map((event) => (
              <article
                key={event._id}
                className="
                  group
                  overflow-hidden
                  rounded-3xl
                  border border-white/[0.07]
                  bg-white/[0.025]
                  transition-all duration-500
                  hover:-translate-y-2
                  hover:border-violet-500/20
                  hover:bg-white/[0.04]
                  hover:shadow-2xl
                  hover:shadow-violet-950/20
                "
              >

                {/* IMAGE */}

                <div className="relative h-64 overflow-hidden bg-[#111018]">

                  <img
                    src={
                      event.imageUrl ||
                      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={event.title}
                    className="
                      h-full w-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  <div className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/70
                    via-black/10
                    to-transparent
                  " />

                  {/* CATEGORY */}

                  <div className="absolute left-4 top-4">
                    <span className="
                      rounded-full
                      border border-white/10
                      bg-black/35
                      px-3 py-1.5
                      text-[11px]
                      font-medium
                      text-white
                      backdrop-blur-md
                    ">
                      {event.category || "Event"}
                    </span>
                  </div>

                  {/* PRICE */}

                  <div className="
                    absolute
                    bottom-4 right-4
                    rounded-xl
                    border border-white/10
                    bg-black/40
                    px-3 py-2
                    text-sm
                    font-semibold
                    text-white
                    backdrop-blur-md
                  ">
                    {formatPrice(event.ticketPrice)}
                  </div>

                </div>

                {/* CONTENT */}

                <div className="p-5">

                  <h2 className="
                    line-clamp-1
                    text-lg
                    font-semibold
                    text-[#ECE8F1]
                  ">
                    {event.title}
                  </h2>

                  <p className="
                    mt-2
                    line-clamp-2
                    text-sm
                    leading-6
                    text-[#797283]
                  ">
                    {event.description ||
                      "An amazing experience awaits you."}
                  </p>

                  <div className="mt-5 space-y-3">

                    {/* DATE */}

                    <div className="
                      flex
                      items-center
                      gap-3
                      text-xs
                      text-[#8C8697]
                    ">
                      <FaCalendarAlt className="text-violet-400" />

                      <span>
                        {formatDate(event.date)}
                      </span>
                    </div>

                    {/* LOCATION */}

                    <div className="
                      flex
                      items-center
                      gap-3
                      text-xs
                      text-[#8C8697]
                    ">
                      <FaMapMarkerAlt className="text-violet-400" />

                      <span className="line-clamp-1">
                        {event.location ||
                          "Location TBA"}
                      </span>
                    </div>

                    {/* SEATS */}

                    <div className="
                      flex
                      items-center
                      gap-3
                      text-xs
                      text-[#8C8697]
                    ">
                      <FaTicketAlt className="text-violet-400" />

                      <span>
                        {event.availableSeats ?? 0}{" "}
                        seats available
                      </span>
                    </div>

                  </div>

                  {/* VIEW EVENT */}

                  <button
                    onClick={() =>
                      navigate(
                        `/events/${event._id}`
                      )
                    }
                    className="
                      mt-6
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.035]
                      px-4 py-3
                      text-sm
                      font-medium
                      text-[#D8D3E0]
                      transition-all
                      duration-300
                      hover:border-violet-500/20
                      hover:bg-violet-500/10
                      hover:text-violet-300
                    "
                  >
                    View Event

                    <FaArrowRight
                      size={11}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </button>

                </div>
              </article>
            ))}

          </div>
        )}
      </section>
    </div>
  );
};

export default Events;