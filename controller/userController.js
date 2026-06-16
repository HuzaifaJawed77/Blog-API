const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/apiUtils");

//Get current user profile
const getMyProfile = async (req, res) => {
  try {
    const user = req.user;
    return successResponse(
      res,
      200,
      "User profile retrieved successfully",
      user,
    );
  } catch (error) {
    next(error);
  }
};

//Update user profile

const updateMyProfile = async (req, res) => {
  try {
    // Only allow updating username and bio for now
    const { username, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio },
      { new: true, runValidators: true },
    );
    return successResponse(res, 200, "Profile updated successfully", user);
  } catch (error) {
    next(error);
  }
};

// Delete user account

const deleteMyAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.clearCookie("refreshToken");
    return successResponse(res, 200, "Account deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    return successResponse(res, 200, "Users retrieved successfully", {
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Delete any user (admin only)

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    if (user._id.toString() === req.user._id.toString()) {
      return errorResponse(
        res,
        400,
        "You cannot delete your own account this way",
      );
    }

    await User.findByIdAndDelete(userId);
    return successResponse(res, 200, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

//change user role (admin only)

const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return errorResponse(
        res,
        400,
        "Invalid role. Role must be either 'user' or 'admin'.",
      );
    }

    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    return successResponse(res, 200, "User role updated successfully", user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  getAllUsers,
  deleteUser,
  changeUserRole,
};
