const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModels");

const protectRoute = async (req, res, next) => {
  try {
   
    const token = req.cookies.jwt;
   
    if (!token) {
      return res.status(401).json({ msg: "unAuthorised-> No token Present" });
    }
    
    const decode = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ msg: "unAuthoried-> invalid access" });
    }

   
    const user = await userModel.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(309).json({ msg: "User Not found" });
    }
    
    req.user = user;
    
    next();
  } catch (error) {
    res.status(501).json({ msg: `protectError-> ${error}` });
  }
};

module.exports = protectRoute;
