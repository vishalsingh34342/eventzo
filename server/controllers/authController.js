const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../utils/email.utils");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");

const genrateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

//register user
exports.registerUser = async (req, res) => {
  const { name, email, password,role } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({
          error: "All fields are required"
      });
  }

  if (!email.includes("@")) {
      return res.status(400).json({
          error: "Invalid email"
      });
  }
  if (password.length < 6) {
      return res.status(400).json({
          error: "Password must be at least 6 characters"
      });
  }

  let userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ error: "user already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
     role: role || "user",
      isVerified: false,
    });
    // await user.save();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`otp for ${email} : ${otp}`);
    await OTP.create({ email, otp, action: "account_verification" });
    await sendOtpEmail(email, otp, "account_verification");

    res
      .status(201)
      .json({
        message:
          "User register successfully ,Please check your email for OTP to verify your account",
        email: user.email,
      });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//login user
// login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      error: "Invalid Credentials! Please sign up first",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      error: "Invalid Credentials! Enter a valid password",
    });
  }

  // Account verification check
  if (!user.isVerified) {
    return res.status(400).json({
      error: "Please verify your account first",
    });
  }

  // Generate JWT token
  const token = genrateToken(user._id, user.role);

  return res.status(200).json({
    message: "Login successfully",

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },

    token,
  });
};
exports.verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;



    const otpRecord = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });

    console.log("OTP SAVED:", otpRecord);
    if (!otpRecord) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await OTP.deleteMany({
      email,
      action: "account_verification",
    });

    const token = genrateToken(user._id, user.role);

    return res.status(200).json({
      message: "Account verified successfully. You can log in.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token,
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message,
    });

  }
};
