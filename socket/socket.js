const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});


const userSocketMap = {}; // {userId: socketId}

// Function to get the socket ID of a receiver
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Socket connection event
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;  // Get userId from query

  if (userId) {
    userSocketMap[userId] = socket.id;  // Store the socket ID for the user
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  // Emit online users list
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);

    if (userId) {
      delete userSocketMap[userId];  // Remove the user from the map
      console.log(`User ${userId} disconnected`);
    }

    // Emit updated online users list
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

// Exporting app, io, and server to use in other modules
module.exports = { app, io, server,getReceiverSocketId };
