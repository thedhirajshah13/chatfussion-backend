const conversationModel = require("../Models/conversation");
const messageModel = require("../Models/message");
const mongoose = require("mongoose");
const {getReceiverSocketId,io}=require ('../socket/socket')


const sendMessage = async (req, res) => {
  const { message } = req.body;
  const { id: reciverId } = req.params;
  const senderId = req.user._id;

  console.log("Online users:", Object.keys(userSocketMap));
console.log("Receiver ID:", reciverId.toString());
console.log("Receiver Socket ID:", getReceiverSocketId(reciverId.toString()));


  let conversation = await conversationModel.findOne({
    participant: { $all: [senderId, reciverId] },
  });

  if (!conversation) {
    conversation = await conversationModel.create({
      participant: [senderId, reciverId],
      messages: [],
    });
  }

  const newmessage = new messageModel({
    senderId,
    reciverId,
    message,
  });

  if (newmessage) {
    conversation.messages.push(newmessage._id);
  }
  await Promise.all([newmessage.save(), conversation.save()]);
 
  const receiverSocketId=getReceiverSocketId(reciverId)
  console.log("receiverSocketId",receiverSocketId)
  if(receiverSocketId){
    io.to(receiverSocketId).emit("newmessage",newmessage)
  }

  
  return res.status(201).json({ msg: "message sent succesfully" });
};

// GET MESSAGE between login user and the previuos chat with

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
      return res.status(200).json({ msg: "no conversation" });
    }
    return res
      .status(201)
      .json({ msg: "success", conversation: conversation.messages });
  } catch (error) {
    console.log(`get message ${error}`);
    res.status(501).json({ msg: "server error" });
  }
};

module.exports = { sendMessage, getMessage };
