


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

import express from "express";
import { loginUser, registerUser, logoutUser, forgetPassword, verifyOtp, resetPassword, verifyUser, getOTP } from "../controllers/authController.js";


export const authenticationRouter = express.Router();



authenticationRouter.post("/register", registerUser);
authenticationRouter.post("/login", loginUser);
authenticationRouter.post("/logout", logoutUser);
authenticationRouter.post("/forgot-password", forgetPassword);
authenticationRouter.post("/verify-otp", verifyOtp);
authenticationRouter.post("/reset-password", resetPassword);
authenticationRouter.post("/get-otp", getOTP);
authenticationRouter.post("/verify-account", verifyUser);