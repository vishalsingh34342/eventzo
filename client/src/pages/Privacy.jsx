import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#08070D] text-white pt-28">
      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8">
        {/* HEADER */}
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-400">
            Privacy Policy
          </p>

          <h1 className="mt-4 text-4xl font-semibold text-[#F4F1FA] sm:text-5xl">
            Your privacy matters
          </h1>

          <p className="mt-5 text-sm text-white/40">
            Last updated: September 2026
          </p>
        </div>

        {/* CONTENT */}
        <div className="mt-12 space-y-10">
          <PrivacySection
            title="1. Information We Collect"
            text="When you use Eventzo, we may collect information such as your name, email address, account details, booking information, and other information that you voluntarily provide while using the platform."
          />

          <PrivacySection
            title="2. How We Use Your Information"
            text="We use collected information to provide and improve Eventzo services, process bookings, communicate with you, maintain account security, and provide relevant service-related updates."
          />

          <PrivacySection
            title="3. Booking Information"
            text="Information related to your event bookings may be stored so that you can view and manage your bookings. We may also use this information to provide booking confirmations and other service notifications."
          />

          <PrivacySection
            title="4. Data Security"
            text="We take reasonable measures to protect the information handled by our platform. However, no online service can guarantee complete security of information transmitted or stored online."
          />

          <PrivacySection
            title="5. Third-Party Services"
            text="Eventzo may use third-party services such as hosting, analytics, email, payment, or other infrastructure providers. These services may process information according to their own privacy policies."
          />

          <PrivacySection
            title="6. Cookies"
            text="Eventzo may use cookies or similar technologies to maintain sessions, remember preferences, improve the user experience, and understand how the platform is used."
          />

          <PrivacySection
            title="7. Your Choices"
            text="You may contact us regarding your account information or questions about how your information is handled. Certain information may need to be retained when required for operational, security, or legal purposes."
          />

          <PrivacySection
            title="8. Policy Updates"
            text="We may update this privacy policy from time to time. Any changes will be reflected on this page along with an updated revision date."
          />

          <PrivacySection
            title="9. Contact Us"
            text="For privacy-related questions or concerns, please contact the Eventzo support team through our Contact page."
          />
        </div>
      </section>
    </div>
  );
};

const PrivacySection = ({ title, text }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white sm:text-2xl">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-[#80798B] sm:text-base">
        {text}
      </p>
    </section>
  );
};

export default Privacy;