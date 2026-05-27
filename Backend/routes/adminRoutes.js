const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const MenuItem = require("../models/menuItem");

const router = express.Router();

// Protected admin dashboard route
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const menuItems = await MenuItem.find();

    res.json({
      message: "Välkommen till Tankad Tacos adminpanel.",
      loggedInUser: req.user.username,
      restaurant: {
        name: "Tankad Tacos",
        concept: "Late-night taco truck in Stockholm"
      },
      menu: menuItems
    });
  } catch (error) {
    res.status(500).json({
      message: "Kunde inte hämta meny från databasen.",
      error: error.message
    });
  }
});

// Protected route for adding menu items
router.post("/menu", authMiddleware, async (req, res) => {
  try {
    const { name, category, description, fillings, price } = req.body;

    if (!name || !category || !description || !price) {
      return res.status(400).json({
        message: "Namn, kategori, beskrivning och pris måste anges."
      });
    }

    const newMenuItem = new MenuItem({
      name,
      category,
      description,
      fillings,
      price
    });

    await newMenuItem.save();

    res.status(201).json({
      message: "Menyobjekt skapades.",
      menuItem: newMenuItem
    });
  } catch (error) {
    res.status(500).json({
      message: "Kunde inte skapa menyobjekt.",
      error: error.message
    });
  }
});

module.exports = router;