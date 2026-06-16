const express = require("express");
const userRouter = express.Router();

const{
    getMyProfile,
    updateMyProfile,
    deleteMyAccount,
    getAllUsers,
    deleteUser,
    changeUserRole,
} = require("../controller/userController");

const {protect ,authorize} = require("../middleware/authMiddleware");

// User routes

userRouter.get("/me", protect, getMyProfile);
userRouter.put("/me", protect, updateMyProfile);
userRouter.delete("/me", protect, deleteMyAccount);

// Admin only routes 
userRouter.get("/", protect, authorize("admin"), getAllUsers);
userRouter.delete("/:id", protect, authorize("admin"), deleteUser);
userRouter.put("/:id/role", protect, authorize("admin"), changeUserRole);

module.exports = userRouter;