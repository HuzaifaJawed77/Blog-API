const express = require('express');
const authRouter = express.Router();

const { register, login, refreshToken, logout ,changePassword } = require("../controller/authController");
const {protect} = require("../middleware/authMiddleware");
const {registerValidation, loginValidation} = require("../middleware/validationMiddleware");
// Registration and login routes are public
authRouter.post("/register" ,registerValidation, register);
authRouter.post("/login" , loginValidation, login);
authRouter.post("/refresh-token" , refreshToken);


// Logout and change password routes should be protected
authRouter.post("/logout" , protect, logout);
authRouter.put("/change-password" , protect, changePassword);

module.exports = authRouter;