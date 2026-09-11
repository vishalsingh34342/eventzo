import React from "react";
import {
  FaTicketAlt,
  FaCalendarAlt,
  FaUsers,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-[#08070D] text-white pt-28">
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
            About Eventzo
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#F4F1FA] sm:text-5xl md:text-6xl">
            Making every event worth remembering
          </h1>

          <p className="mt-6 text-base leading-8 text-[#8D8798] md:text-lg">
            Eventzo is an event discovery and booking platform designed to
            help people discover exciting experiences, find events they love,
            and manage their bookings in one simple place.
          </p>
        </div>

        {/* MISSION */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <FaHeart />
            </div>

            <h2 className="text-2xl font-semibold text-white">
              Our Mission
            </h2>

            <p className="mt-4 leading-7 text-[#80798B]">
              Our goal is to make finding and booking events simple,
              enjoyable, and accessible. Whether it is music, technology,
              sports, business, or entertainment, Eventzo helps bring
              memorable experiences closer to you.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <FaUsers />
            </div>

            <h2 className="text-2xl font-semibold text-white">
              Our Vision
            </h2>

            <p className="mt-4 leading-7 text-[#80798B]">
              We want Eventzo to become a place where event organizers and
              attendees can connect through experiences that people are
              excited to be part of.
            </p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-16">
          <h2 className="text-center text-3xl font-semibold text-[#F2EFF7]">
            Why Eventzo?
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<FaTicketAlt />}
              title="Easy Booking"
              text="Discover events and manage your bookings from one convenient platform."
            />

            <Feature
              icon={<FaCalendarAlt />}
              title="Discover Events"
              text="Explore concerts, technology events, sports, business events and more."
            />

            <Feature
              icon={<FaUsers />}
              title="Better Experiences"
              text="Find experiences worth sharing and create memories with your people."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-600/15 via-indigo-500/[0.08] to-transparent p-8 text-center md:p-12">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Discover your next experience
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#8B8496]">
            Explore upcoming events and find something worth showing up for.
          </p>

   <Link
  to="/events"
  className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-1"
>
  Explore Events
</Link>
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, text }) => {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#797283]">
        {text}
      </p>
    </div>
  );
};

export default About;