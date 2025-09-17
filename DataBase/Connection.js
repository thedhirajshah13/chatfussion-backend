const mongoose = require("mongoose");
require("dotenv").config();

const MongoConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USERNAMES}:${process.env.PASSWORD}@cluster0.ndejk.mongodb.net/ChatFussion?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("DataBase Connectes Successfully");
  } catch (error) {
    console.log(`Error-> ${error}`);
  }
};

module.exports = MongoConnect;
