const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String, // text message
      trim: true,
    },
    media: {
      type: String, // URL of image/video stored in Cloudinary
    },
    mediaType: {
      type: String, // 'image' | 'video' | null
      enum: ["image", "video", null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
