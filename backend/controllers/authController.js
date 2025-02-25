const bcrypt = require("bcryptjs");

const User = require("../models/userModal");
const generateToken = require("../lib/utils");

// User Signup
const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // 0. Required Fields Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 1. Password Validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters." });
    }

    // 2. Check if user already exists
    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists." });

    //3.  Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup controller: ", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// User Login
const login = (req, res) => {
  res.send("Login Route is now working");
};

//User Logout
const logout = (req, res) => {
  res.send("Logout Route is now working");
};

module.exports = { signup, login, logout };
