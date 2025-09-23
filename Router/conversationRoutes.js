const express = require("express");

const {
  sendMessage,
  getMessage,
  
} = require("../controler/conversationController");
const addUserToConversation = require("../controler/addNewUserController");
const protectRoute = require("../middelware/protectRoute");
const uploadMedia = require("../middelware/multer");

const conversationRoute = express.Router();

conversationRoute.get("/:id", protectRoute, getMessage);
conversationRoute.post("/sendmessage/:id", protectRoute,uploadMedia.single('media'), sendMessage);
conversationRoute.post("/adduser", protectRoute, addUserToConversation);

module.exports = conversationRoute;
