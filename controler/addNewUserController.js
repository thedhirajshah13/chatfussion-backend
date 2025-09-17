const conversationModel = require("../Models/conversation");
const userModel = require("../Models/userModels");

const addUserToConversation = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const { searchedUserId } = req.body;

    if (!searchedUserId) {
      return res.status(400).json({ msg: "Searched user ID is required" });
    }

    // Step 1: Find the user by username
    const searchUserExists = await userModel.findOne({ username: searchedUserId });
    if (!searchUserExists) {
      return res.status(404).json({ msg: "User not found or may not exist" });
    }

    const searchedUser = searchUserExists._id;

    // Step 2: Prevent conversation with self
    if (searchedUser.toString() === loggedInUser.toString()) {
      return res.status(400).json({ msg: "Cannot start conversation with yourself" });
    }

    // Step 3: Check if a conversation already exists
    const existingConversation = await conversationModel.findOne({
      participant: { $all: [loggedInUser, searchedUser] },
    });

    // Step 4: If not, create it
    if (!existingConversation) {
      await conversationModel.create({
        participant: [loggedInUser, searchedUser],
        messages: [],
      });
    }

    return res.status(201).json({ msg: "Conversation created or already exists." });
  } catch (error) {
    console.error(`ERROR->addUserToConversation: ${error}`);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = addUserToConversation;
