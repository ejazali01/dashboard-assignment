import { User } from "../models/user.model.js";

export const generateAccessOrRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: true });
    return { accessToken, refreshToken };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
    };
  }
};
