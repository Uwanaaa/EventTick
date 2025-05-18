// ● POST /auth/register → Register a new user                                Done
// ● POST /auth/login → User login                                            Done
// ● POST /auth/logout → User logout                                          Done
// ● POST /auth/forgot-password → Reset password                              Done
// ● POST /auth/verify-otp → Verify OTP for signup                            Done
// ● POST /auth/update-profile → Update user profile                          Done
// ● POST /admin/block-user/{id} → Block a user (prevents login & access)     Done
// ● POST /admin/unblock-user/{id} → Unblock a user (restores access)         Done
// ● DELETE /admin/delete-user/{id} → Permanently delete a user               Done

import { User } from "../models/user.js";
import asyncHandler from "express-async-handler";
import { generateToken, verifyToken, generateOTP } from "../utils/generateToken.js";
//import { JsonWebTokenError } from "jsonwebtoken";
import { redisClient } from "../config/redis.js"
//import Undici from "undici-types";
import { request } from "http";
import { sendEmail } from "../service/emailService.js";




const otpExpiryTime = 600000 //set to 10mins



export const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });

  if (user && (await user.matchPassword(password))) {
    if (user.status === "blocked") {
      return res.status(403).json({ error: "This user has been blocked" })
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie with proper configuration
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
      domain: process.env.COOKIE_DOMAIN || undefined
    });

    // Send response
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});


// still want to handle sending of email
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, gender, date_of_birth, role, country } = req.body;
  
  if (!req.body) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      gender,
      date_of_birth,
      role,
      country
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: "Error creating user" });
  }
});

export const logoutUser = asyncHandler(async (req, res) => {

  try {

    const authToken = req.cookies.token

    //Calculate the total time remaining until the token expires
    const expirationTime = req.user.exp - Math.floor(Date.now() / 1000);

    await redisClient.setEx(`blacklisted: ${authToken}`, expirationTime, "true");

    res.clearCookie("token");

    return res.status(200).json({ "successful": "Logout out successfully" })
  } catch (err) {
    console.log("Error from Logout: ", err);
    return res.status(400).json({ error: err.message })
  }


});


export const forgetPassword = asyncHandler(async (req, res) => {

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "Invalid Email" });
  }


  const otp = generateOTP();

  user.otp = otp;
  user.otpExpiry = Date.now() + otpExpiryTime;
  user.save();
  try {
    await sendEmail(user.email, "Forget Password", "forgotPassword", { name: user.name, otp, expiration_time: 10 })
    console.log("Email is been sent");
  } catch (err) {
    console.log("Email not sent: ", err);
  }
  return res.status(200).json({ message: "Check your email" });


})

export const verifyOtp = asyncHandler(async (req, res) => {

  const { email, otp } = req.body;


  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "Invalid email" });
  }
  console.log(user.otp)
  if (user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired OTP" })
  }
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.save();

  return res.status(200).json({ message: "Succcessfully verified OTP", token: generateToken(user._id) });
})

export const resetPassword = asyncHandler(async (req, res) => {

  const { newPassword } = req.body;


  try {
    req.user.password = newPassword;

    req.user.save();

    await sendEmail(req.user.email, "Password Reset", "passwordSetSuccessful", { name: req.user.name })
    return res.status(200).json({ message: "Password reset successful" })
  } catch (err) {
    console.log("Reset Password error: ", err);
    res.status(500).json({ error: "Internal server error" })
  }
})


export const verifyUser = asyncHandler(async (req, res) => {

  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!otp) {
      return res.status(400).json({ error: "otp field required" })
    }

    if (!user.otp) {
      return res.status(400).json({ error: "generate otp" })
    }
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expiry opt" });
    }
    user.status = "active";
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.save();

    await sendEmail(user.email, "Account Verified", "accountVerified", { name: user.name })

    return res.status(200).json({ message: "Account successfully verified" })
  } catch (err) {
    console.log("from verifyUser: ", err);
    return res.status(500).json({ error: "Internal server error" })
  }

})

export const getOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid email" })
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + otpExpiryTime;
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.save();

    await sendEmail(user.email, " Your OTP", "getOtp", { name: user.name, otp, expiration_time: 10 })

    return res.status(200).json({ message: "check your mail" });
  } catch (err) {
    console.error("getOTP error: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
})


export const updateUser = asyncHandler(async (req, res) => {

  const { id } = req.params;
  const allowedUpdates = ["name", "password", "phone", "bio", "profile_pic"]
  const updates = Object.keys(req.body).reduce((acc, key) => {
    if (allowedUpdates.includes(key)) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});

  try {
    if (req.user.id !== id) {
      return res.status(403).json({ error: "You can only update your data" })
    }
    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    return res.status(200).json({ message: "User updated successful", user })
  } catch (err) {
    console.error("Update Error: ", err);
    return res.status(500).json({ error: "internal server error" })
  }
})
