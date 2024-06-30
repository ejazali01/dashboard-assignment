import { generateAccessOrRefreshToken } from "../helper/token.js";
import { Otp } from "../models/otp.models.js";
import { User } from "../models/user.model.js";
import sendEmail from "../utils/sendMail.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((fields) => fields.trim() == "")) {
      return res.status(400).json({
        status: 400,
        message: "all fields are required",
      });
    }

    // check user email are registered or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "user not found with this email",
      });
    }

    // if user found then check password is correct or not
    const correctPassword = await user.isPasswordCorrect(password);

    if (!correctPassword) {
      return res.status(400).json({
        status: 400,
        message: "Invalid credintial",
      });
    }

    if (!(user && correctPassword)) {
      return res.status(400).json({
        status: 400,
        message: "plesae provide valid credintial",
      });
    }

    const { accessToken, refreshToken } = await generateAccessOrRefreshToken(
      user._id
    );
    console.log(accessToken, refreshToken);
    const logedInUser = await User.findById(user._id).select(
      "-password -accessToken -refreshToken -__v"
    );

    const accessOption = {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 60,
    };

    const refreshOption = {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 60,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessOption)
      .cookie("accessToken", refreshToken, refreshOption)
      .json({
        status: 200,
        message: "login success",
        data: logedInUser,
      });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if ([fullName, email, password].some((fields) => fields.trim() == "")) {
      return res.status(400).json({
        status: 400,
        message: "all fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "User already exists!",
      });
    }
    const user = new User({ fullName, email, password });

    if (!user) {
      res.status(400).json({
        status: 400,
        message: "user not found !",
      });
    }

    // Generate OTP
    const otpRecord = new Otp({ userId: user._id });
    const otp = await otpRecord.generateOtp();
    // console.log("otp : ", otp)
    await otpRecord.save();

    // // Send OTP to user's email
    const emailRes = await sendEmail(
      email,
      "Verify your email",
      "This is your email verification",
      `Your OTP is: <b style={{fontSize: "25px"; color : "green"}}> ${otp} </b>, This OTP will Expires in 10 minutes`
    );

    if (emailRes.success !== true) {
      return res.status(400).json({
        status: 400,
        message: "somthing went wrong while sending eamil",
      });
    }

    // if (!user.isVerified) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "OTP send to your email, please verify your email",
    //   });
    // }

    // Save the user
    await user.save();

    return res.status(201).json({
      status: 201,
      message: "OTP send to your email, please verify your email",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const VerifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if ([email, otp].some((fields) => fields.trim() == "")) {
      return res.status(400).json({
        status: 400,
        message: "OTP is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        status: 400,
        message: "user not found !",
      });
    }

    const otpRecord = await Otp.findOne({
      userId: user._id,
      verifyUserOtp: otp,
      used: false,
    });
    if (!otpRecord) {
      return res.status(400).json({
        status: 400,
        message: "Invalid or expired OTP",
      });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({
        status: 400,
        message: "OTP has expired",
      });
    }

    // Verify user and mark OTP as used
    user.isVerified = true;
    await user.save();

    otpRecord.used = true;
    await otpRecord.save();

    return res.status(200).json({
      status: 200,
      message: "email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        status: 400,
        message: "user not found !",
      });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      res.status(400).json({
        status: 400,
        message: "Already verified",
      });
    }

    //generate new otp and send to user email
    const otpRecord = new Otp({ userId: user._id });
    const otp = await otpRecord.generateOtp();
    await otpRecord.save();

    // // Send OTP to user's email
    const emailRes = await sendEmail(
      email,
      "Verify your email",
      "This is your email verification",
      `Your OTP is: <b style={{fontSize: "25px"; color : "green"}}> ${otp} </b>, This OTP will Expires in 10 minutes`
    );

    if (emailRes.success !== true) {
      return res.status(400).json({
        status: 400,
        message: "somthing went wrong while sending eamil",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "A new OTP has been send to your email",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

