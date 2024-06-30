import express from "express"
import { VerifyEmailOtp, login, resendOtp, signUp } from "../controllers/user.controller.js";

const router = express.Router();

// routes
router.post('/login' , login)
router.post('/signup' , signUp)
router.post("/signup/verify-otp", VerifyEmailOtp)
router.post("/signup/resend-otp", resendOtp)

export default router