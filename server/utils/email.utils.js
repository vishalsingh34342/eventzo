// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");

// dotenv.config();

// // console.log("EMAIL_USER:", process.env.EMAIL_USER);
// // console.log("EMAIL_PASS EXISTS:", !!process.env.EMAIL_PASS);

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
//   tls: {
//     family: 4  
//   }
// });


// exports.sendOtpEmail = async (email, otp, type) => {

//     try {

//         const isVerification = type === "account_verification";

//         const subject = isVerification
//             ? "Eventzo - Verify Your Account"
//             : "Eventzo - Event Booking OTP";

//         const heading = isVerification
//             ? "Verify Your Account"
//             : "Confirm Your Event Booking";

//         const description = isVerification
//             ? "Use the OTP below to verify your Eventzo account."
//             : "Use the OTP below to confirm your event booking.";

//         const mailOptions = {

//             from: `"Eventzo" <${process.env.EMAIL_USER}>`,

//             to: email,

//             subject: subject,

//             html: `
// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">

//     <meta name="viewport" content="width=device-width, initial-scale=1.0">

//     <title>${subject}</title>
// </head>

// <body style="
//     margin: 0;
//     padding: 0;
//     background-color: #f4f4f5;
//     font-family: Arial, Helvetica, sans-serif;
// ">

//     <div style="
//         width: 100%;
//         padding: 40px 0;
//     ">

//         <div style="
//             max-width: 500px;
//             margin: 0 auto;
//             background: #ffffff;
//             border-radius: 16px;
//             overflow: hidden;
//             box-shadow: 0 8px 30px rgba(0,0,0,0.08);
//         ">

//             <!-- Header -->

//             <div style="
//                 background: linear-gradient(135deg, #2563eb, #7c3aed);
//                 padding: 30px;
//                 text-align: center;
//             ">

//                 <h1 style="
//                     margin: 0;
//                     color: #ffffff;
//                     font-size: 30px;
//                     letter-spacing: 1px;
//                 ">
//                     Eventzo
//                 </h1>

//                 <p style="
//                     margin: 8px 0 0;
//                     color: #e0e7ff;
//                     font-size: 14px;
//                 ">
//                     Your events. Your experience.
//                 </p>

//             </div>


//             <!-- Content -->

//             <div style="
//                 padding: 35px 30px;
//                 text-align: center;
//             ">

//                 <h2 style="
//                     margin: 0 0 15px;
//                     color: #18181b;
//                     font-size: 24px;
//                 ">
//                     ${heading}
//                 </h2>


//                 <p style="
//                     margin: 0 auto 25px;
//                     color: #71717a;
//                     font-size: 15px;
//                     line-height: 1.6;
//                 ">
//                     ${description}
//                 </p>


//                 <!-- OTP -->

//                 <div style="
//                     background: #f4f4f5;
//                     border: 1px dashed #a1a1aa;
//                     border-radius: 12px;
//                     padding: 20px;
//                     margin: 25px 0;
//                 ">

//                     <p style="
//                         margin: 0 0 8px;
//                         color: #71717a;
//                         font-size: 13px;
//                     ">
//                         Your OTP
//                     </p>

//                     <div style="
//                         color: #2563eb;
//                         font-size: 32px;
//                         font-weight: bold;
//                         letter-spacing: 8px;
//                     ">
//                         ${otp}
//                     </div>

//                 </div>


//                 <p style="
//                     color: #71717a;
//                     font-size: 13px;
//                     line-height: 1.5;
//                 ">
//                     This OTP is valid for a limited time.
//                     Please do not share this code with anyone.
//                 </p>

//             </div>


//             <!-- Footer -->

//             <div style="
//                 border-top: 1px solid #e4e4e7;
//                 padding: 20px;
//                 text-align: center;
//             ">

//                 <p style="
//                     margin: 0;
//                     color: #a1a1aa;
//                     font-size: 12px;
//                 ">
//                     © ${new Date().getFullYear()} Eventzo. All rights reserved.
//                 </p>

//                 <p style="
//                     margin: 6px 0 0;
//                     color: #a1a1aa;
//                     font-size: 12px;
//                 ">
//                     This is an automated email. Please do not reply.
//                 </p>

//             </div>

//         </div>

//     </div>

// </body>

// </html>
//             `
//         };

//         await transporter.sendMail(mailOptions);

//         console.log(
//             `OTP email sent successfully to ${email} for ${type}`
//         );

//     } catch (error) {

//         console.error(
//             `Error sending OTP email to ${email} for ${type}:`,
//             error.message
//         );

//         throw error;
//     }
// };

// exports.sendBookingEmail = async (userEmail, userName, eventTitle) => {

//     try {

//         const mailOptions = {
//             from: `"Eventzo" <${process.env.EMAIL_USER}>`,
//             to: userEmail,

//             subject: "Eventzo - Booking Confirmed 🎉",

//             html: `
//                 <!DOCTYPE html>
//                 <html>
//                 <body style="
//                     margin: 0;
//                     padding: 40px 20px;
//                     background: #f4f4f5;
//                     font-family: Arial, sans-serif;
//                 ">

//                     <div style="
//                         max-width: 500px;
//                         margin: auto;
//                         background: white;
//                         border-radius: 16px;
//                         overflow: hidden;
//                         box-shadow: 0 8px 25px rgba(0,0,0,0.08);
//                     ">

//                         <div style="
//                             padding: 30px;
//                             text-align: center;
//                             background: linear-gradient(135deg, #2563eb, #7c3aed);
//                             color: white;
//                         ">
//                             <h1 style="margin: 0;">
//                                 Eventzo
//                             </h1>

//                             <p style="margin: 8px 0 0;">
//                                 Event Booking Platform
//                             </p>
//                         </div>

//                         <div style="padding: 30px;">

//                             <h2 style="color: #18181b;">
//                                 Booking Confirmed 🎉
//                             </h2>

//                             <p style="color: #52525b;">
//                                 Hi ${userName},
//                             </p>

//                             <p style="
//                                 color: #52525b;
//                                 line-height: 1.6;
//                             ">
//                                 Your booking has been successfully confirmed.
//                             </p>

//                             <div style="
//                                 margin-top: 25px;
//                                 padding: 20px;
//                                 background: #f8fafc;
//                                 border-radius: 12px;
//                             ">

//                                 <p style="margin: 0; color: #18181b;">
//                                     <strong>Event:</strong>
//                                     ${eventTitle}
//                                 </p>

//                             </div>

//                             <p style="
//                                 margin-top: 25px;
//                                 color: #71717a;
//                             ">
//                                 Thank you for choosing Eventzo ❤️
//                             </p>

//                         </div>

//                         <div style="
//                             padding: 20px;
//                             text-align: center;
//                             border-top: 1px solid #e4e4e7;
//                         ">

//                             <p style="
//                                 margin: 0;
//                                 color: #a1a1aa;
//                                 font-size: 12px;
//                             ">
//                                 © ${new Date().getFullYear()} Eventzo
//                             </p>

//                         </div>

//                     </div>

//                 </body>
//                 </html>
//             `
//         };

//         await transporter.sendMail(mailOptions);

//         console.log(
//             `Booking email sent successfully to ${userEmail}`
//         );

//     } catch (error) {

//         console.error(
//             `Error sending booking email to ${userEmail}:`,
//             error.message
//         );

//         throw error;
//     }
// };

const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// ===============================
// SEND OTP EMAIL
// ===============================

exports.sendOtpEmail = async (email, otp, type) => {
  try {
    const isVerification = type === "account_verification";

    const subject = isVerification
      ? "Eventzo - Verify Your Account"
      : "Eventzo - Event Booking OTP";

    const heading = isVerification
      ? "Verify Your Account"
      : "Your Event Booking OTP";

    const description = isVerification
      ? "Use this OTP to verify your Eventzo account."
      : "Use this OTP to complete your event booking.";

    const msg = {
      to: email,

      from: {
        name: "Eventzo",
        email: process.env.SENDGRID_FROM_EMAIL,
      },

      subject,

      html: `
<!DOCTYPE html>
<html lang="en">

<body style="
  margin: 0;
  padding: 20px;
  background: #f4f4f5;
  font-family: Arial, sans-serif;
">

  <div style="
    max-width: 400px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 12px;
    padding: 30px 20px;
    text-align: center;
    border: 1px solid #e4e4e7;
  ">

    <h1 style="
      margin: 0 0 10px;
      color: #2563eb;
      font-size: 28px;
    ">
      Eventzo
    </h1>

    <h2 style="
      margin: 0 0 12px;
      color: #18181b;
      font-size: 20px;
    ">
      ${heading}
    </h2>

    <p style="
      margin: 0 0 20px;
      color: #71717a;
      font-size: 14px;
    ">
      ${description}
    </p>

    <div style="
      display: inline-block;
      padding: 14px 25px;
      background: #f4f4f5;
      border: 1px dashed #2563eb;
      border-radius: 10px;
      margin-bottom: 18px;
    ">

      <span style="
        font-size: 30px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #2563eb;
      ">
        ${otp}
      </span>

    </div>

    <p style="
      margin: 0;
      color: #a1a1aa;
      font-size: 12px;
    ">
      Please do not share this OTP with anyone.
    </p>

  </div>

</body>

</html>
      `,
    };

    await sgMail.send(msg);

    console.log(
      `OTP email sent successfully to ${email} for ${type}`
    );

  } catch (error) {

    console.error(
      `Error sending OTP email to ${email} for ${type}:`,
      error.response?.body || error.message
    );

    throw error;
  }
};

// ===============================
// SEND BOOKING CONFIRMATION EMAIL
// ===============================

// ===============================
// SEND BOOKING CONFIRMATION EMAIL
// ===============================

exports.sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const msg = {
      to: userEmail,

      from: {
        name: "Eventzo",
        email: process.env.SENDGRID_FROM_EMAIL,
      },

      subject: "Eventzo - Booking Confirmed 🎉",

      html: `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
</head>

<body style="
  margin: 0;
  padding: 40px 20px;
  background-color: #f4f4f5;
  font-family: Arial, Helvetica, sans-serif;
">

  <div style="
    max-width: 500px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  ">

    <!-- Header -->
    <div style="
      padding: 30px;
      text-align: center;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: #ffffff;
    ">

      <h1 style="
        margin: 0;
        font-size: 30px;
      ">
        Eventzo
      </h1>

      <p style="
        margin: 8px 0 0;
        font-size: 14px;
        color: #e0e7ff;
      ">
        Event Booking Platform
      </p>

    </div>


    <!-- Content -->
    <div style="padding: 30px;">

      <h2 style="
        margin: 0 0 20px;
        color: #18181b;
      ">
        Booking Confirmed 🎉
      </h2>

      <p style="
        margin: 0 0 15px;
        color: #52525b;
      ">
        Hi ${userName},
      </p>

      <p style="
        margin: 0;
        color: #52525b;
        line-height: 1.6;
      ">
        Your booking has been successfully confirmed.
        Your payment has been approved by the Eventzo team.
      </p>


      <!-- Event Details -->
      <div style="
        margin-top: 25px;
        padding: 20px;
        background-color: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e4e4e7;
      ">

        <p style="
          margin: 0;
          color: #18181b;
          font-size: 15px;
        ">
          <strong>Event:</strong> ${eventTitle}
        </p>

        <p style="
          margin: 10px 0 0;
          color: #16a34a;
          font-size: 14px;
        ">
          <strong>Status:</strong> Confirmed / Paid
        </p>

      </div>


      <p style="
        margin-top: 25px;
        color: #71717a;
        line-height: 1.5;
        font-size: 14px;
      ">
        Thank you for choosing Eventzo. We hope you have a great experience! ❤️
      </p>

    </div>


    <!-- Footer -->
    <div style="
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e4e4e7;
    ">

      <p style="
        margin: 0;
        color: #a1a1aa;
        font-size: 12px;
      ">
        © ${new Date().getFullYear()} Eventzo. All rights reserved.
      </p>

      <p style="
        margin: 6px 0 0;
        color: #a1a1aa;
        font-size: 12px;
      ">
        This is an automated email. Please do not reply.
      </p>

    </div>

  </div>

</body>
</html>
      `,
    };

    await sgMail.send(msg);

    console.log(
      `Booking confirmation email sent successfully to ${userEmail}`
    );

  } catch (error) {

    console.error(
      `Error sending booking confirmation email to ${userEmail}:`,
      error.response?.body || error.message
    );

    throw error;
  }
};