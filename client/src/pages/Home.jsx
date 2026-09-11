import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaTicketAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaStar,
} from "react-icons/fa";
import gsap from "gsap";

import api from "../utils/axios";

const categories = [
  "All",
  "Technology",
  "Music",
  "Business",
  "Sports",
  "Entertainment",
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const searchRef = useRef(null);
  const cardsRef = useRef(null);

  const navigate = useNavigate();

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/events");

        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Hero animation
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      headingRef.current,
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
      }
    )
      .fromTo(
        subRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.5"
      )
      .fromTo(
        searchRef.current,
        {
          y: 25,
          opacity: 0,
          scale: 0.97,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.35"
      );

    gsap.to(".hero-orb-1", {
      y: -25,
      x: 15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".hero-orb-2", {
      y: 20,
      x: -15,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  // Event card animation
  useEffect(() => {
    if (!cardsRef.current || !events.length) return;

    gsap.fromTo(
      cardsRef.current.children,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [events, activeCategory, search]);

  const filteredEvents = events.filter((event) => {
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      event.title?.toLowerCase().includes(searchValue) ||
      event.location?.toLowerCase().includes(searchValue) ||
      event.category?.toLowerCase().includes(searchValue);

    const matchesCategory =
      activeCategory === "All" ||
      event.category?.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const formatDate = (date) => {
    if (!date) return "Date TBA";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "Free";

    if (Number(price) === 0) return "Free";

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#08070D] text-white">

      {/* ================= HERO ================= */}

      <section
        ref={heroRef}
        className="
          relative flex min-h-[760px]
          items-center overflow-hidden
          pt-28
        "
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.16),_transparent_35%),radial-gradient(circle_at_80%_30%,_rgba(79,70,229,0.12),_transparent_30%)]" />

        {/* Decorative orbs */}
        <div
          className="
            hero-orb-1 absolute
            -left-24 top-24
            h-72 w-72
            rounded-full
            bg-violet-600/10
            blur-3xl
          "
        />

        <div
          className="
            hero-orb-2 absolute
            right-[-100px] top-40
            h-80 w-80
            rounded-full
            bg-indigo-500/10
            blur-3xl
          "
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">

          {/* Small Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2 text-xs font-medium text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Discover experiences worth remembering
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="
              max-w-5xl
              text-5xl font-semibold
              leading-[1.02]
              tracking-[-0.04em]
              text-[#F4F1FA]
              sm:text-6xl
              md:text-7xl
              lg:text-[88px]
            "
          >
            Find your next
            <span className="block bg-gradient-to-r from-violet-300 via-violet-500 to-indigo-400 bg-clip-text text-transparent">
              unforgettable event.
            </span>
          </h1>

          {/* Description */}
          <p
            ref={subRef}
            className="
              mt-7 max-w-2xl
              text-base leading-7
              text-[#9F99AE]
              sm:text-lg
            "
          >
            From live concerts and tech conferences to sports and business
            events, discover places where great experiences begin.
          </p>

          {/* Search */}
          <div
            ref={searchRef}
            className="
              mt-10 flex max-w-3xl
              flex-col gap-3
              rounded-2xl
              border border-white/[0.08]
              bg-white/[0.035]
              p-2
              shadow-2xl
              shadow-black/20
              backdrop-blur-xl
              sm:flex-row
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, cities or categories..."
                className="
                  h-14 w-full rounded-xl
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

            <button
              onClick={() => {
                document
                  .getElementById("events")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
              className="
                h-14 rounded-xl
                bg-gradient-to-r
                from-violet-600 to-indigo-600
                px-7
                text-sm font-semibold
                text-white
                shadow-lg
                shadow-violet-600/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-violet-600/35
              "
            >
              Explore Events
            </button>
          </div>

          {/* Trust text */}
          <div className="mt-7 flex flex-wrap items-center gap-6 text-xs text-[#6F6979]">
            <span>Curated experiences</span>
            <span className="h-1 w-1 rounded-full bg-[#514B5A]" />
            <span>Secure booking</span>
            <span className="h-1 w-1 rounded-full bg-[#514B5A]" />
            <span>Verified events</span>
          </div>
        </div>
      </section>

      {/* ================= EVENT SECTION ================= */}

      <section
        id="events"
        className="
          relative
          mx-auto max-w-7xl
          px-5 pb-24
          md:px-8
        "
      >
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
              Explore
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#F2EFF7] md:text-4xl">
              Events worth showing up for
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#807A8B]">
              Find something exciting happening near you.
            </p>
          </div>

          <Link
            to="/events"
            className="
              group inline-flex items-center gap-2
              text-sm font-medium
              text-[#B4AEC0]
              transition
              hover:text-violet-300
            "
          >
            View all events
            <FaArrowRight
              size={12}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Categories */}

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                whitespace-nowrap rounded-full
                border px-4 py-2
                text-xs font-medium
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

        {/* Event Cards */}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  h-[420px]
                  animate-pulse
                  rounded-3xl
                  border border-white/[0.06]
                  bg-white/[0.025]
                "
              />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div
            className="
              rounded-3xl
              border border-white/[0.07]
              bg-white/[0.02]
              px-6 py-20
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
          <div
            ref={cardsRef}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredEvents.slice(0, 6).map((event) => (
              <article
                key={event._id}
                className="
                  group overflow-hidden
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
                {/* Image */}

                <div className="relative h-64 overflow-hidden bg-[#111018]">
                  <img
                    src={
                      event.imageUrl ||
                      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={event.title}
                    className="
                      h-full w-full object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Category */}

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
                      {event.category || "Event"}
                    </span>
                  </div>

                  {/* Price */}

                  <div className="absolute bottom-4 right-4 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md">
                    {formatPrice(event.ticketPrice)}
                  </div>
                </div>

                {/* Content */}

                <div className="p-5">

                  <h3 className="line-clamp-1 text-lg font-semibold text-[#ECE8F1]">
                    {event.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#797283]">
                    {event.description ||
                      "An amazing experience awaits you."}
                  </p>

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-3 text-xs text-[#8C8697]">
                      <FaCalendarAlt className="text-violet-400" />
                      <span>{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#8C8697]">
                      <FaMapMarkerAlt className="text-violet-400" />
                      <span className="line-clamp-1">
                        {event.location || "Location TBA"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#8C8697]">
                      <FaTicketAlt className="text-violet-400" />
                      <span>
                        {event.availableSeats ?? 0} seats available
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/events/${event._id}`)
                    }
                    className="
                      mt-6 flex w-full
                      items-center justify-center
                      gap-2 rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.035]
                      px-4 py-3
                      text-sm font-medium
                      text-[#D8D3E0]
                      transition-all duration-300
                      hover:border-violet-500/20
                      hover:bg-violet-500/10
                      hover:text-violet-300
                    "
                  >
                    View event
                    <FaArrowRight
                      size={11}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================= STATS ================= */}

      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 py-14 md:grid-cols-4 md:px-8">

          <div className="border-r border-white/[0.06] px-5 text-center md:px-8">
            <p className="text-3xl font-semibold text-[#EEEAF4]">
              10K+
            </p>
            <p className="mt-2 text-xs text-[#716B7B]">
              Event lovers
            </p>
          </div>

          <div className="px-5 text-center md:border-r md:border-white/[0.06] md:px-8">
            <p className="text-3xl font-semibold text-[#EEEAF4]">
              500+
            </p>
            <p className="mt-2 text-xs text-[#716B7B]">
              Live events
            </p>
          </div>

          <div className="border-r border-t border-white/[0.06] px-5 pt-8 text-center md:border-t-0 md:px-8 md:pt-0">
            <p className="text-3xl font-semibold text-[#EEEAF4]">
              50+
            </p>
            <p className="mt-2 text-xs text-[#716B7B]">
              Cities
            </p>
          </div>

          <div className="border-t border-white/[0.06] px-5 pt-8 text-center md:border-t-0 md:px-8 md:pt-0">
            <p className="flex items-center justify-center gap-2 text-3xl font-semibold text-[#EEEAF4]">
              4.9
              <FaStar
                size={18}
                className="text-violet-400"
              />
            </p>

            <p className="mt-2 text-xs text-[#716B7B]">
              Average rating
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">

        <div
          className="
            relative overflow-hidden
            rounded-[32px]
            border border-violet-500/15
            bg-gradient-to-br
            from-violet-600/15
            via-indigo-500/[0.08]
            to-transparent
            p-8
            md:p-14
          "
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">

            <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-400">
              Your next memory starts here
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Ready to experience something different?
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#8B8496] md:text-base">
              Browse upcoming events and reserve your spot before
              they fill up.
            </p>

            <button
  onClick={() => {
    document
      .getElementById("events")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}
  className="
    mt-8 inline-flex items-center gap-2
    rounded-xl
    bg-gradient-to-r
    from-violet-600 to-indigo-600
    px-6 py-3.5
    text-sm font-semibold text-white
    shadow-lg
    shadow-violet-600/20
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-violet-600/35
  "
>
  Explore Events
  <FaArrowRight size={12} />
</button>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/[0.06] bg-[#06050A]">

        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">

          <div className="grid gap-12 md:grid-cols-4">

            {/* Brand */}

            <div className="md:col-span-2">

              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    bg-gradient-to-br
                    from-violet-500 to-indigo-600
                    text-white
                  "
                >
                  <FaTicketAlt size={17} />
                </div>

                <div>
                  <div className="text-xl font-bold text-white">
                    Event<span className="text-violet-400">zo</span>
                  </div>

                  <div className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[#615B6C]">
                    Experiences
                  </div>
                </div>
              </Link>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#6F6878]">
                Discover the best experiences, connect with your
                people, and make memories that last.
              </p>

              {/* Socials */}

              <div className="mt-6 flex gap-3">

                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-[#817A8D] transition hover:border-violet-500/20 hover:text-violet-400"
                >
                  <FaInstagram size={13} />
                </a>

                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-[#817A8D] transition hover:border-violet-500/20 hover:text-violet-400"
                >
                  <FaFacebookF size={13} />
                </a>

                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-[#817A8D] transition hover:border-violet-500/20 hover:text-violet-400"
                >
                  <FaTwitter size={13} />
                </a>

                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-[#817A8D] transition hover:border-violet-500/20 hover:text-violet-400"
                >
                  <FaLinkedinIn size={13} />
                </a>

              </div>
            </div>

            {/* Explore */}

            <div>
              <h3 className="text-sm font-semibold text-[#E7E2ED]">
                Explore
              </h3>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  to="/"
                  className="text-sm text-[#6F6878] transition hover:text-violet-300"
                >
                  Home
                </Link>

                <Link
                  to="/events"
                  className="text-sm text-[#6F6878] transition hover:text-violet-300"
                >
                  Events
                </Link>

                <Link
                  to="/my-bookings"
                  className="text-sm text-[#6F6878] transition hover:text-violet-300"
                >
                  My Bookings
                </Link>
              </div>
            </div>

            {/* Company */}

            <div>
              <h3 className="text-sm font-semibold text-[#E7E2ED]">
                Company
              </h3>

              <div className="mt-5 flex flex-col gap-3">
                <Link
                  to="/about"
                  className="text-sm text-[#6F6878] transition hover:text-violet-300"
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  className="text-sm text-[#6F6878] transition hover:text-violet-300"
                >
                  Contact
                </Link>

                <Link
                  to="/privacy"
                  className="text-sm text-[#6F6878] transition hover:text-violet-300"
                >
                  Privacy
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom */}

          <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-[#5F5869] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Eventzo. All rights reserved.
            </p>

            <p>
              Built for better experiences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;