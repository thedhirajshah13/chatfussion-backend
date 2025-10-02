const mongoose = require("mongoose");
const userModel = require("../Models/userModels");
const conversationModel = require("../Models/conversation.js");


const searchUserController = async (req, res) => {
  const { username } = req.query;
  // console.log(username);

  try {
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Find one user by unique username excluding the logged-in user
    const user = await userModel
      .findOne({
        username: { $regex: `^${username}$`, $options: "i" }, // exact match, case-insensitive
        _id: { $ne: new mongoose.Types.ObjectId(req.user._id) },
      })
      .select("-password -confirmPassword");

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    const senderId = req.user._id;
    const reciverId = user._id;
    // console.log(senderId, reciverId);
    let getConversation = await conversationModel.findOne({
      participant: { $all: [senderId, reciverId] },
    });
    if (!getConversation) {
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error during user search:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = searchUserController;
