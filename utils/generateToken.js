const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  // Generate JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Set token in cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // Set to true in production
    sameSite: "none", // Adjust based on your requirements
    domain: "chatfussion-backend.onrender.com",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
};

module.exports = generateToken;