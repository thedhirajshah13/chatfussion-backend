const express = require("express");
const { Signup, Login, Logout, updateProfile,getUserById } = require("../controler/authController");
const uploads = require("../middelware/multer");
const protectRoute = require("../middelware/protectRoute");
const authRouter = express.Router();

authRouter.post("/signup", uploads.single("file"), Signup);
authRouter.post("/login", Login);
authRouter.post("/logout",protectRoute, Logout);
authRouter.get("/getUserDetails/:id",protectRoute, getUserById);
authRouter.put("/updateProfile", protectRoute, uploads.single("file"),updateProfile)

module.exports = authRouter;
