const express = require("express");
const {
  getInteractionByName,
  recordInteraction,
} = require("../controllers/interactionController");

const router = express.Router();

router.get("/:name", getInteractionByName);
router.post("/", recordInteraction);

module.exports = router;
