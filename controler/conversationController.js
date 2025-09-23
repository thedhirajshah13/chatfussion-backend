const conversationModel = require("../Models/conversation");
const messageModel = require("../Models/message");
const { getReceiverSocketId, io } = require("../socket/socket");

// uploadMedia is your multer-cloudinary middleware
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Check for file (image/video)
    let mediaUrl = null;
    let mediaType = null;
    if (req.file) {
      mediaUrl = req.file.path;
      mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
    }

    // Find or create conversation
    let conversation = await conversationModel.findOne({
      participant: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participant: [senderId, receiverId],
        messages: [],
      });
    }

    // Create new message
    const newMessage = new messageModel({
      senderId,
      receiverId,
      message: message || "", // optional text
      media: mediaUrl,
      mediaType,
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([newMessage.save(), conversation.save()]);

    // Emit via socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newmessage", newMessage);
    }

    return res.status(201).json({ msg: "Message sent successfully", message: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// GET MESSAGE between logged-in user and another user
const getMessage = async (req, res) => {
  try {
    const { id: chatWith } = req.params;
    const senderId = req.user._id;

    const conversation = await conversationModel
      .findOne({
        participant: { $all: [senderId, chatWith] },
      })
      .populate("messages");

    if (!conversation) {
      return res.status(200).json({ msg: "No conversation" });
    }

    return res.status(200).json({ msg: "Success", conversation: conversation.messages });
  } catch (error) {
    console.error("Get message error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { sendMessage, getMessage };
