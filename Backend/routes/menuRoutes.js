const express = require("express");
const MenuItem = require("../models/menuItem");

const router = express.Router();

//get menu items for website
router.get("/", async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ isAvailable: true }).sort({
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

//get one specific menu item
router.get("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem || !menuItem.isAvailable) {
      return res.status(404).json({
        message: "Menyobjektet kunde inte hittas."
      });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({
      message: "Kunde inte hämta menyobjektet.",
      error: error.message
    });
  }
});

module.exports = router;