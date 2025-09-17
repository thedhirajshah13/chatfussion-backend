const express = require("express");
const { Signup, Login, Logout } = require("../controler/authController");
const uploads = require("../middelware/multer");
const protectRoute = require("../middelware/protectRoute");
const authRouter = express.Router();

authRouter.post("/signup", uploads.single("file"), Signup);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout);

module.exports = authRouter;
