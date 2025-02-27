const User = require("../models/userModel");
const Message = require("../models/messageModel");
const cloudinary = require("../lib/cloudinary");

// Get all the users to display in the sidebar
const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar route: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all the messages between two users (message history)
const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages route: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      // Upload Image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo: real-time functionality goes here (actual chating => socket.io)

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage route: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getUsersForSidebar, getMessages, sendMessage };
