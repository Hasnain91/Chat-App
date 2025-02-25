const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const connectDB = require("./config/db.js");

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
  connectDB();
});
