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
    console.log("req.file", req.file);

    const newUser = new userModel({
      name,
      username,
      password: hashedPassword,
      gender,
      profileImg: `${req.file.path}` || "",
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

// Get single user details by id
const getUserById=async(req,res)=>{
  try{
    const {id}=req.params;
    console.log(id);
    const user=await userModel.findById(id).select("-password");
    if(!user){
      return res.status(404).json({msg:"User not found",success:false});
    }
    return res.status(200).json({msg:"User fetched successfully",success:true,user});
  }
  catch(error){
    console.error(`Get User By ID ERROR->${error}`);
    return res.status(500).json({ msg: "Internal Server Error", success: false });
  }
}


// Update the user profile
const updateProfile = async (req, res) => {
  try {
    const { name, username, password, confirmPassword } = req.body;
    const userId = req.user._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }

    // Check if username is being updated and is unique
    if (username && username !== user.username) {
      const usernameExists = await userModel.findOne({ username });
      if (usernameExists) {
        return res.status(409).json({ msg: "Username already taken", success: false });
      }
      user.username = username;
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update password if provided
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Password and Confirm Password must be same", success: false });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update profile image if file uploaded
    if (req.file && req.file.path) {
      user.profileImg = req.file.path;
    }

    await user.save();

    return res.status(200).json({
      msg: "Profile updated successfully",
      success: true,
      id: user._id,
      name: user.name,
      username: user.username,
      gender: user.gender,
      profileImg: user.profileImg,
    });
  } catch (error) {
    console.error(`Update Profile ERROR->${error}`);
    return res.status(500).json({ msg: "Internal Server Error", success: false });
  }
};

// ...existing code...

module.exports = { Signup, Login, Logout,getUserById,updateProfile };

