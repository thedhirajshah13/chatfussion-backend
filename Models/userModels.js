const db = require("mongoose");

const userSchema = db.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 5,
    },
    confirmPassword: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: true,
      enum: ["male", "female"],
    },
    profileImg: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const userModel = db.model("User", userSchema);

module.exports = userModel;
