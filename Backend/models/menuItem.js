const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fillings: {
    type: [String],
    default: []
  },
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("MenuItem", menuItemSchema);