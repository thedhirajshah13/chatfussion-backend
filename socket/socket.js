const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chatfussion.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.auth.userId;  // Updated for Socket.IO v4+
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  io.emit("getOnlineUser", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server, getReceiverSocketId };
