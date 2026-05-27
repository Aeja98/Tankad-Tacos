const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Användarnamn måste anges"],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, "E-post måste anges"],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Lösenord måste anges"]
  },
  account_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);