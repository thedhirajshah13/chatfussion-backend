const userModel = require("../Models/userModels");
const messageModel = require("../Models/message");
const conversationModel = require("../Models/conversation");

const getUserForSideBar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    // Fetch conversations of logged-in user with latest message
    const conversations = await conversationModel
      .find({ participant: loggedInUser })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // get latest message only
      })
      .lean();

    if (!conversations || conversations.length === 0) {
      const loggedInUserDetails = await userModel
        .findById(loggedInUser)
        .select("-password");
      return res.status(200).json({
        msg: "No conversations found",
        user: [],
        loggedInUserDetails,
      });
    }

    // Get other participant IDs in each conversation
    const conversationUserIds = conversations.map((conv) =>
      conv.participant.find(
        (id) => id.toString() !== loggedInUser.toString()
      )
    );

    // Fetch user details
    const users = await userModel
      .find({ _id: { $in: conversationUserIds } })
      .select("-password")
      .lean();

    // Map conversation ID to latest message timestamp
    const userLastMessageMap = {};
    conversations.forEach((conv) => {
      const otherUserId = conv.participant.find(
        (id) => id.toString() !== loggedInUser.toString()
      );
      const lastMsgDate = conv.messages[0]?.createdAt || 0;
      userLastMessageMap[otherUserId.toString()] = lastMsgDate;
    });

    // Sort users by latest message timestamp (descending)
    const usersSorted = users.sort((a, b) => {
      const dateA = new Date(userLastMessageMap[a._id.toString()]);
      const dateB = new Date(userLastMessageMap[b._id.toString()]);
      return dateB - dateA;
    });

    // Logged-in user details
    const loggedInUserDetails = await userModel
      .findById(loggedInUser)
      .select("-password");

    return res.status(201).json({
      msg: "success",
      user: usersSorted,
      loggedInUserDetails,
    });
  } catch (error) {
    console.log(`ERROR->SideBarUser: ${error}`);
    return res.status(501).json({ msg: "Internal Server Error" });
  }
};

module.exports = getUserForSideBar;
