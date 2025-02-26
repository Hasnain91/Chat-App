const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // Check if there is a token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is valid
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token " });
    }

    // Find the user and de-select password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute Middleware: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = protectRoute;
