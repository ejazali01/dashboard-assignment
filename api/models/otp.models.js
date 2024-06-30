import mongoose from "mongoose";

const otpSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    verifyUserOtp: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

otpSchema.methods.generateOtp = async function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    this.verifyUserOtp = otp;
    this.expiresAt = Date.now() + 10 * 60 * 1000; // Set expiration time (e.g., 10 minutes)
    return this.verifyUserOtp;
} 


export const Otp = mongoose.model("Otp", otpSchema);