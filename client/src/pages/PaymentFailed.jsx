import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
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
          border-red-500
          border-x border-b border-white/10
        "
      >
        <FaTimesCircle className="text-red-400 text-7xl mx-auto mb-6" />

        <h1 className="text-4xl font-black text-white mb-4">
          Payment Failed
        </h1>

        <p className="text-white/50 mb-8 text-lg">
          We couldn't process your payment. Please try again.
        </p>

        <div className="space-y-4">
          <Link
            to="/my-bookings"
            className="
              block w-full
              bg-red-500
              hover:bg-red-400
              text-white
              font-bold
              py-4 px-6
              rounded-xl
              transition
              shadow-lg
            "
          >
            Try Again
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
            Return to Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;