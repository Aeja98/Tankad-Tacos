const mongoose = require("mongoose");

//menu item info
const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Namn måste anges."],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Kategori måste anges."],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Beskrivning måste anges."],
      trim: true
    },
    fillings: {
      type: [String],
      default: []
    },
    price: {
      type: Number,
      required: [true, "Pris måste anges."],
      min: [0, "Priset kan inte vara negativt."]
    },
    isSpecial: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);