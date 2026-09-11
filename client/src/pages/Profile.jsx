import React, { useContext, useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaShieldAlt,
  FaCheckCircle,
  FaEdit,
  FaSave,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const currentUser = user?.user || user;

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
  }, [currentUser]);

  const isAdmin = currentUser?.role === "admin";

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Ye endpoint backend mein banana padega.
      // Abhi profile UI ready hai.
      const { data } = await api.put("/auth/profile", {
        name,
        email,
      });

      const updatedUser = data?.user || data;

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (storedUser?.user) {
        storedUser.user = {
          ...storedUser.user,
          ...updatedUser,
        };
      } else {
        Object.assign(storedUser, updatedUser);
      }

      localStorage.setItem(
        "user",
        JSON.stringify(storedUser)
      );

      setSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08070D] text-white pt-28 px-5 pb-16">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
            Account
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-[#F4F1FA]">
            {isAdmin ? "Admin Profile" : "My Profile"}
          </h1>

          <p className="mt-3 text-[#817A8D]">
            Manage your account information and profile details.
          </p>
        </div>

        {/* ALERTS */}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* PROFILE CARD */}

        <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025]">

          {/* TOP */}

          <div className="border-b border-white/[0.07] bg-gradient-to-r from-violet-600/10 to-indigo-500/5 px-6 py-8 sm:px-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                  <FaUserCircle size={56} />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {currentUser?.name || "User"}
                  </h2>

                  <p className="mt-1 text-sm text-[#817A8D]">
                    {currentUser?.email || "No email"}
                  </p>

                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      isAdmin
                        ? "bg-violet-500/10 text-violet-300"
                        : "bg-indigo-500/10 text-indigo-300"
                    }`}
                  >
                    {isAdmin ? "Administrator" : "User"}
                  </span>
                </div>

              </div>

              {!editing && (
                <button
                  onClick={() => {
                    setSuccess("");
                    setError("");
                    setEditing(true);
                  }}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-xl
                    border border-white/10
                    bg-white/[0.04]
                    px-5 py-3
                    text-sm font-semibold
                    text-white/80
                    transition
                    hover:border-violet-500/30
                    hover:bg-violet-500/10
                    hover:text-violet-300
                  "
                >
                  <FaEdit size={14} />
                  Edit Profile
                </button>
              )}

            </div>
          </div>

          {/* DETAILS */}

          <div className="p-6 sm:p-8">

            <form
              onSubmit={handleUpdateProfile}
              className="grid gap-6 md:grid-cols-2"
            >

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Full Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                    className="
                      w-full rounded-xl
                      border border-white/10
                      bg-black/20
                      px-4 py-3
                      text-white
                      outline-none
                      transition
                      focus:border-violet-500
                    "
                  />
                ) : (
                  <div className="
                    flex items-center gap-3
                    rounded-xl
                    border border-white/[0.06]
                    bg-white/[0.02]
                    px-4 py-3.5
                  ">
                    <FaUserCircle className="text-violet-400" />
                    <span className="text-white/80">
                      {currentUser?.name || "Not available"}
                    </span>
                  </div>
                )}
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Email Address
                </label>

                {editing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="
                      w-full rounded-xl
                      border border-white/10
                      bg-black/20
                      px-4 py-3
                      text-white
                      outline-none
                      transition
                      focus:border-violet-500
                    "
                  />
                ) : (
                  <div className="
                    flex items-center gap-3
                    rounded-xl
                    border border-white/[0.06]
                    bg-white/[0.02]
                    px-4 py-3.5
                  ">
                    <FaEnvelope className="text-violet-400" />
                    <span className="break-all text-white/80">
                      {currentUser?.email || "Not available"}
                    </span>
                  </div>
                )}
              </div>

              {/* ROLE */}

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Account Role
                </label>

                <div className="
                  flex items-center gap-3
                  rounded-xl
                  border border-white/[0.06]
                  bg-white/[0.02]
                  px-4 py-3.5
                ">
                  <FaShieldAlt className="text-violet-400" />

                  <span className="capitalize text-white/80">
                    {currentUser?.role || "user"}
                  </span>
                </div>
              </div>

              {/* VERIFICATION */}

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Account Status
                </label>

                <div className="
                  flex items-center gap-3
                  rounded-xl
                  border border-white/[0.06]
                  bg-white/[0.02]
                  px-4 py-3.5
                ">
                  <FaCheckCircle
                    className={
                      currentUser?.isVerified
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }
                  />

                  <span
                    className={
                      currentUser?.isVerified
                        ? "text-emerald-300"
                        : "text-amber-300"
                    }
                  >
                    {currentUser?.isVerified
                      ? "Verified"
                      : "Not Verified"}
                  </span>
                </div>
              </div>

              {/* EDIT ACTIONS */}

              {editing && (
                <div className="flex flex-col gap-3 pt-2 sm:flex-row md:col-span-2">

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-violet-600
                      to-indigo-600
                      px-6 py-3
                      text-sm font-semibold
                      text-white
                      shadow-lg
                      shadow-violet-600/20
                      transition
                      hover:-translate-y-0.5
                      disabled:opacity-50
                    "
                  >
                    <FaSave size={14} />

                    {loading
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setName(currentUser?.name || "");
                      setEmail(currentUser?.email || "");
                      setEditing(false);
                      setError("");
                      setSuccess("");
                    }}
                    className="
                      rounded-xl
                      border border-white/10
                      bg-white/[0.04]
                      px-6 py-3
                      text-sm font-semibold
                      text-white/70
                      transition
                      hover:bg-white/[0.08]
                    "
                  >
                    Cancel
                  </button>

                </div>
              )}
            </form>
          </div>
        </div>

        {/* ROLE NOTE */}

        <div className="
          mt-6
          rounded-2xl
          border border-white/[0.06]
          bg-white/[0.02]
          p-5
        ">
          <p className="text-sm leading-6 text-[#746E7E]">
            {isAdmin
              ? "As an administrator, you can manage events and bookings from the Admin Dashboard."
              : "You can manage your bookings and discover new events from your dashboard."}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Profile;