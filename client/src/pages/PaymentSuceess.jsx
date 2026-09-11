import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#08070D]">
      <div
        className="
          bg-[#100E17]
          p-10
          rounded-3xl
          shadow-2xl
          max-w-md
          w-full
          text-center
          border-t-8
          border-emerald-500
          border-x border-b border-white/10
        "
      >
        <FaCheckCircle className="text-emerald-400 text-7xl mx-auto mb-6" />

        <h1 className="text-4xl font-black text-white mb-4">
          Payment Successful!
        </h1>

        <p className="text-white/50 mb-8 text-lg">
          Your payment has been completed successfully. Your booking
          confirmation has been sent to your registered email address.
        </p>

        <div className="space-y-4">
          <Link
            to="/my-bookings"
            className="
              block w-full
              bg-emerald-500
              hover:bg-emerald-400
              text-white
              font-bold
              py-4 px-6
              rounded-xl
              transition
              shadow-lg
            "
          >
            View My Bookings
          </Link>

          <Link
            to="/"
            className="
              block w-full
              bg-white/5
              hover:bg-white/10
              text-white/70
              font-bold
              py-4 px-6
              rounded-xl
              transition
            "
          >
            Discover More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;