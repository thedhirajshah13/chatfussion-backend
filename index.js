const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRouter = require("./Router/authRoute.js");
const MongoConnect = require("./DataBase/Connection.js");
const conversationRoute = require("./Router/conversationRoutes.js");
const userRoute = require("./Router/User.js");
const cors = require("cors");
const { app, server } = require("./socket/socket");
const searchRoute =require('./Router/searchRoute.js')

// const app = express();
dotenv.config();

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "https://chatfussion.netlify.app"],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Middleware
app.use(cookieParser()); // Use cookie-parser before the routes
app.use(express.json()); // Use express.json() before the routes
app.use("/uploads", express.static("uploads")); // use to server image in frontend with url->https://chatfussion.onrender.com/

// Routes
app.use("/auth", authRouter);
app.use("/", conversationRoute);
app.use("/user", userRoute);
app.use("/user", userRoute)
app.use('/search',searchRoute);

// MongoDB connection and server start
const PORT=process.env.PORT || 8000;
const startServer = async () => {
  await MongoConnect();
  server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
};

startServer();
