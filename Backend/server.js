const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const menuRoutes = require("./routes/menuRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/menu", menuRoutes);

//test route
app.get("/", (req, res) => {
  res.json({
    message: "Tankad Tacos API is running"
  });
});

//connect to MongoDB + start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });