const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const MenuItem = require("../models/menuItem");

const router = express.Router();

//helper function to clean fillings/options
function cleanFillings(fillings) {
  if (!fillings) {
    return [];
  }

  if (Array.isArray(fillings)) {
    return fillings.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof fillings === "string") {
    return fillings
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

//protected admin dashboard route
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({
      isSpecial: -1,
      category: 1,
      name: 1
    });

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
      message: "Kunde inte hämta admin-data.",
      error: error.message
    });
  }
});

//get all menu items in admin
router.get("/menu", authMiddleware, async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({
      isSpecial: -1,
      category: 1,
      name: 1
    });

    res.json(menuItems);
  } catch (error) {
    res.status(500).json({
      message: "Kunde inte hämta menyn.",
      error: error.message
    });
  }
});

//add new menu item
router.post("/menu", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      fillings,
      price,
      isSpecial,
      isAvailable
    } = req.body;

    if (!name || !category || !description || price === undefined || price === "") {
      return res.status(400).json({
        message: "Namn, kategori, beskrivning och pris måste anges."
      });
    }

    const priceNumber = Number(price);

    if (Number.isNaN(priceNumber)) {
      return res.status(400).json({
        message: "Pris måste vara ett nummer."
      });
    }

    const newMenuItem = new MenuItem({
      name,
      category,
      description,
      fillings: cleanFillings(fillings),
      price: priceNumber,
      isSpecial: Boolean(isSpecial),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
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

//update menu item
router.put("/menu/:id", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      fillings,
      price,
      isSpecial,
      isAvailable
    } = req.body;

    if (!name || !category || !description || price === undefined || price === "") {
      return res.status(400).json({
        message: "Namn, kategori, beskrivning och pris måste anges."
      });
    }

    const priceNumber = Number(price);

    if (Number.isNaN(priceNumber)) {
      return res.status(400).json({
        message: "Pris måste vara ett nummer."
      });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        description,
        fillings: cleanFillings(fillings),
        price: priceNumber,
        isSpecial: Boolean(isSpecial),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({
        message: "Menyobjektet kunde inte hittas."
      });
    }

    res.json({
      message: "Menyobjekt uppdaterades.",
      menuItem: updatedMenuItem
    });
  } catch (error) {
    res.status(500).json({
      message: "Kunde inte uppdatera menyobjekt.",
      error: error.message
    });
  }
});

//delete menu item
router.delete("/menu/:id", authMiddleware, async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedMenuItem) {
      return res.status(404).json({
        message: "Menyobjektet kunde inte hittas."
      });
    }

    res.json({
      message: "Menyobjekt raderades.",
      menuItem: deletedMenuItem
    });
  } catch (error) {
    res.status(500).json({
      message: "Kunde inte radera menyobjekt.",
      error: error.message
    });
  }
});

module.exports = router;