const express = require("express");
const protectRoute = require("../middelware/protectRoute.js");
const getUserForSideBar = require("../controler/getUserForSideBar.js");
const searchUserController=require("../controler/searchUserController.js")
const userRoute = express.Router();

userRoute.get("/all", protectRoute, getUserForSideBar);
userRoute.get("/search", protectRoute,searchUserController);

module.exports = userRoute;
