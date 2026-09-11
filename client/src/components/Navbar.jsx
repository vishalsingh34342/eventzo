import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import {
  FaTicketAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

import gsap from "gsap";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const rightRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const currentUser = user?.user || user;

  const isAdmin = currentUser?.role === "admin";

  // =========================
  // NAVBAR ENTRANCE ANIMATION
  // =========================
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      navRef.current,
      {
        y: -90,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
      }
    );

    tl.fromTo(
      logoRef.current,
      {
        x: -30,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.45"
    );

    tl.fromTo(
      linksRef.current,
      {
        y: -15,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: "power3.out",
      },
      "-=0.3"
    );

    tl.fromTo(
      rightRef.current,
      {
        x: 25,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.3"
    );
  }, []);

  // =========================
  // SCROLL ANIMATION
  // =========================
  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;

      if (window.scrollY > 30) {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(11, 10, 18, 0.92)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
          duration: 0.3,
        });
      } else {
        gsap.to(navRef.current, {
          backgroundColor: "rgba(11, 10, 18, 0.65)",
          backdropFilter: "blur(12px)",
          boxShadow: "none",
          duration: 0.3,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logout();

    setProfileOpen(false);
    setMobileOpen(false);

    navigate("/login");
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const addToLinksRef = (el) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  return (
    <nav
      ref={navRef}
      className="
        fixed top-0 left-0 z-50 w-full
        border-b border-white/[0.08]
        bg-[#0B0A12]/65
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto flex h-[78px] max-w-7xl
          items-center justify-between
          px-5 md:px-8
        "
      >
        {/* =========================
            LOGO
        ========================= */}

        <Link
          ref={logoRef}
          to="/"
          className="group flex items-center gap-3"
        >
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-gradient-to-br from-violet-500 to-indigo-600
              text-white
              shadow-lg shadow-violet-500/20
              transition-all duration-300
              group-hover:scale-110
              group-hover:rotate-6
              group-hover:shadow-violet-500/40
            "
          >
            <FaTicketAlt size={18} />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-tight text-[#F4F2FA]">
              Event<span className="text-violet-400">zo</span>
            </span>

            <span className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[#777186]">
              Experiences
            </span>
          </div>
        </Link>

        {/* =========================
            DESKTOP NAV
        ========================= */}

        <div className="hidden items-center gap-8 md:flex">
          {/* HOME */}
          <Link
            ref={addToLinksRef}
            to="/"
            className="
              nav-link relative py-2
              text-sm font-medium text-[#A7A2B5]
              transition-colors duration-300
              hover:text-violet-400
            "
          >
            Home
          </Link>

          {/* MY BOOKINGS - USER ONLY */}
          {user && !isAdmin && (
            <Link
              ref={addToLinksRef}
              to="/my-bookings"
              className="
                nav-link relative py-2
                text-sm font-medium text-[#A7A2B5]
                transition-colors duration-300
                hover:text-violet-400
              "
            >
              My Bookings
            </Link>
          )}

          {/* DASHBOARD */}
          {user && (
            <Link
              ref={addToLinksRef}
              to={isAdmin ? "/admin" : "/dashboard"}
              className="
                nav-link relative py-2
                text-sm font-medium text-[#A7A2B5]
                transition-colors duration-300
                hover:text-violet-400
              "
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div
          ref={rightRef}
          className="hidden items-center gap-3 md:flex"
        >
          {!user ? (
            <>
              {/* LOGIN */}
              <Link
                to="/login"
                className="
                  rounded-xl px-4 py-2
                  text-sm font-medium
                  text-[#B8B3C7]
                  transition-all duration-300
                  hover:text-violet-400
                "
              >
                Login
              </Link>

              {/* GET STARTED */}
              <Link
                to="/register"
                className="
                  group relative overflow-hidden
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600 to-indigo-600
                  px-5 py-2.5
                  text-sm font-semibold text-white
                  shadow-lg shadow-violet-500/20
                  transition-all duration-300
                  hover:scale-105
                  hover:shadow-violet-500/40
                "
              >
                <span className="relative z-10">
                  Get Started
                </span>

                <span
                  className="
                    absolute inset-0
                    -translate-x-full
                    bg-gradient-to-r
                    from-indigo-500 to-violet-500
                    transition-transform duration-500
                    group-hover:translate-x-0
                  "
                />
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* ACCOUNT BUTTON */}

              <button
                onClick={() =>
                  setProfileOpen((prev) => !prev)
                }
                className="
                  flex items-center gap-2
                  rounded-xl
                  border border-white/10
                  bg-white/[0.04]
                  px-3 py-2
                  text-[#E8E5EF]
                  transition-all duration-300
                  hover:border-violet-500/30
                  hover:bg-violet-500/10
                "
              >
                <FaUserCircle
                  size={20}
                  className="text-violet-400"
                />

                <span className="max-w-[120px] truncate text-sm">
                  {currentUser?.name || "Account"}
                </span>

                <FaChevronDown
                  size={10}
                  className={`
                    text-[#8E879D]
                    transition-transform duration-300
                    ${profileOpen ? "rotate-180" : ""}
                  `}
                />
              </button>

              {/* DROPDOWN */}

              {profileOpen && (
                <div
                  className="
                    absolute right-0 top-14
                    w-52 overflow-hidden
                    rounded-2xl
                    border border-white/10
                    bg-[#11101A]/95
                    p-2
                    shadow-2xl
                    backdrop-blur-2xl
                  "
                >
                  {/* DASHBOARD */}
                  <Link
                    to={isAdmin ? "/admin" : "/dashboard"}
                    onClick={() => setProfileOpen(false)}
                    className="
                      block rounded-xl
                      px-4 py-3
                      text-sm text-[#AAA5B7]
                      transition-all duration-200
                      hover:bg-violet-500/10
                      hover:text-violet-300
                    "
                  >
                    Dashboard
                  </Link>

                  {/* PROFILE */}
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="
                      block rounded-xl
                      px-4 py-3
                      text-sm text-[#AAA5B7]
                      transition-all duration-200
                      hover:bg-violet-500/10
                      hover:text-violet-300
                    "
                  >
                    Profile
                  </Link>

                  <div className="my-1 h-px bg-white/[0.06]" />

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="
                      w-full rounded-xl
                      px-4 py-3
                      text-left text-sm
                      text-red-400
                      transition-all duration-200
                      hover:bg-red-500/10
                    "
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================
            MOBILE BUTTON
        ========================= */}

        <button
          onClick={() =>
            setMobileOpen((prev) => !prev)
          }
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl
            border border-white/10
            bg-white/[0.04]
            text-[#D8D4E0]
            transition-all duration-300
            hover:border-violet-500/30
            hover:bg-violet-500/10
            md:hidden
          "
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}

      {mobileOpen && (
        <div
          className="
            border-t border-white/[0.08]
            bg-[#0B0A12]/95
            px-5 py-5
            backdrop-blur-2xl
            md:hidden
          "
        >
          <div className="flex flex-col gap-2">

            {/* HOME */}
            <Link
              to="/"
              onClick={closeMobile}
              className="
                rounded-xl px-4 py-3
                text-[#AAA5B7]
                transition-all
                hover:bg-violet-500/10
                hover:text-violet-300
              "
            >
              Home
            </Link>

            {/* MY BOOKINGS - USER ONLY */}
            {user && !isAdmin && (
              <Link
                to="/my-bookings"
                onClick={closeMobile}
                className="
                  rounded-xl px-4 py-3
                  text-[#AAA5B7]
                  transition-all
                  hover:bg-violet-500/10
                  hover:text-violet-300
                "
              >
                My Bookings
              </Link>
            )}

            {/* DASHBOARD */}
            {user && (
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                onClick={closeMobile}
                className="
                  rounded-xl px-4 py-3
                  text-[#AAA5B7]
                  transition-all
                  hover:bg-violet-500/10
                  hover:text-violet-300
                "
              >
                Dashboard
              </Link>
            )}

            {/* PROFILE */}
            {user && (
              <Link
                to="/profile"
                onClick={closeMobile}
                className="
                  rounded-xl px-4 py-3
                  text-[#AAA5B7]
                  transition-all
                  hover:bg-violet-500/10
                  hover:text-violet-300
                "
              >
                Profile
              </Link>
            )}

            {/* LOGGED OUT */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="
                    mt-2 rounded-xl
                    border border-white/10
                    px-4 py-3
                    text-center
                    text-[#B8B3C7]
                    transition-all
                    hover:border-violet-500/30
                    hover:text-violet-300
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-600 to-indigo-600
                    px-4 py-3
                    text-center
                    font-semibold text-white
                  "
                >
                  Get Started
                </Link>
              </>
            ) : (
              /* LOGGED IN */
              <button
                onClick={handleLogout}
                className="
                  mt-2 rounded-xl
                  bg-red-500/10
                  px-4 py-3
                  text-left
                  text-red-400
                "
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


