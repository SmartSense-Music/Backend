const express = require("express");
const {
  getTimeOfDayByName,
  getAllTimeOfDays,
} = require("../controllers/timeOfDayController");

const router = express.Router();

router.get("/", getAllTimeOfDays);
router.get("/:name", getTimeOfDayByName);

module.exports = router;
