const bcrypt = require("bcryptjs");

const userModel = require("../Models/userModels");
const generateToken = require("../utils/generateToken");

// SignUp
const Signup = async (req, res) => {
  try {
    const { name, username, password, confirmPassword, gender, profileImg } =
      req.body;
    
    const userAlreadyExists = await userModel.findOne({ username });

    if (userAlreadyExists) {
      return res
        .status(309)
        .json({ msg: "user already exist", success: false });
    }

    if (password !== confirmPassword) {
      return res.status(300).json({
        msg: "password and confirmPassword must be same",
        success: false,
      });
    }

    //  Hashed password
    const salt = await bcrypt.genSalt(10);
    
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      username,
      password: hashedPassword,
      gender,
      profileImg: `https://chatfussion.onrender.com/uploads/${req.file.filename}`,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        msg: "user registered succesfully",
        success: true,
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        gender: newUser.gender,
        profileImg: newUser.profileImg,
      });
    }
  } catch (error) {
    console.log(`SignUp ERROR->${error}`);
    return res
      .status(501)
      .json({ msg: "Internal Server Error", success: false });
  }
};
// Login

// Login
const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const isUser = await userModel.findOne({ username });

    if (!isUser) {
      return res
        .status(401)
        .json({ msg: "Invalid username or password", success: false });
    }

    const isPasswordMatched = await bcrypt.compare(password, isUser.password);

    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ msg: "Invalid username or password", success: false });
    }

    generateToken(isUser._id, res);

    return res.status(200).json({
      msg: "Successfully logged in",
      id: isUser._id,
      name: isUser.name,
      username: isUser.username,
      gender: isUser.gender,
      profileImg: isUser.profileImg,
      success: true,
    });
  } catch (error) {
    console.error(`Login ERROR->${error}`);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", success: false });
  }
};

// Logged Out
const Logout = async (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  return res.status(201).json({ msg: "loggedOut Succesfully", success: true });
};
module.exports = { Signup, Login, Logout };
