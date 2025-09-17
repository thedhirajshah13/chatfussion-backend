const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    participant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const conversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = conversationModel;
