const express = require("express");
const {
  getInteractionByName,
} = require("../controllers/interactionController");

const router = express.Router();

router.get("/:name", getInteractionByName);

module.exports = router;
