const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  setRefreshTokenCookie,
} = require("../utils/tokenUtils");

const { successResponse, errorResponse } = require("../utils/apiUtils");

// Register a new user

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "User already exists");
    }

    // Create new user
    const user = new User({ username, email, password });

    // genrate tokens

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

     // Store refresh token in DB
    user.refreshToken = refreshToken;

    await user.save();


    // save refresh token in cookie
    setRefreshTokenCookie(res, refreshToken);

    return successResponse(res, 201, "User registered successfully", {
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    return errorResponse(res, 500, "Server error");
  }
};

// Login user

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly include password (it's excluded by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return errorResponse(res, 401, "Invalid  email or password");
    }

    // Compare password

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    // generate tokens

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
        // Store refresh token in DB
    user.refreshToken = refreshToken;

    await user.save();

    // save refresh token in cookie
    setRefreshTokenCookie(res, refreshToken);

    return successResponse(res, 200, "Login successful", {
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return errorResponse(res, 500, "Server error");
  }
};

// Logout user

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });

    res.clearCookie("refreshToken");

    return successResponse(res, 200, "Logout successful");
  } catch (error) {
    console.error("Error in logout:", error);
    return errorResponse(res, 500, "Server error");
  }
};

// refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return errorResponse(res, 401, "No refresh token provided");
    }
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return errorResponse(res, 401, "Invalid refresh token");
    }


    // generate new access token
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    // Store new refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    // save new refresh token in cookie
    setRefreshTokenCookie(res, newRefreshToken);
    return successResponse(res, 200, "Access token refreshed", { accessToken: newAccessToken });
  }
    catch (error) {
        console.error("Error in refreshToken:", error); 
        return errorResponse(res, 500, "Server error");
    }   
};



// change password

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 401, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, 200, "Password changed successfully");
  } catch (error) {
    console.error("Error in changePassword:", error);
    return errorResponse(res, 500, "Server error");
  }
};

module.exports = {
  register,
  login,
  logout,
  changePassword,
  refreshToken
};
