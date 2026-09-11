import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#08070D] text-white pt-28">
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {/* HEADER */}
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
            Contact
          </p>

          <h1 className="mt-4 text-4xl font-semibold text-[#F4F1FA] sm:text-5xl">
            We would love to hear from you
          </h1>

          <p className="mt-5 text-base leading-7 text-[#8D8798]">
            Have a question, feedback, or need help with your booking?
            Send us a message and our team will get back to you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* CONTACT INFO */}
          <div className="space-y-5">
            <ContactCard
              icon={<FaEnvelope />}
              title="Email"
              value="jashanchoudhary430@gmail.com"
            />

            <ContactCard
              icon={<FaPhoneAlt />}
              title="Phone"
              value="+91 00000 00000"
            />

            <ContactCard
              icon={<FaMapMarkerAlt />}
              title="Location"
              value="India"
            />
          </div>

          {/* FORM */}
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-white">
              Send us a message
            </h2>

            {submitted && (
              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                Your message has been submitted successfully.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Message
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="How can we help?"
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-violet-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

const ContactCard = ({ icon, title, value }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
        {icon}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-white/35">
          {title}
        </p>

        <p className="mt-1 text-sm text-white/75">
          {value}
        </p>
      </div>
    </div>
  );
};

export default Contact;