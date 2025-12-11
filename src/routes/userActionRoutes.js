const express = require("express");
const {
  getUserActionByName,
  getAllActions,
} = require("../controllers/userActionController");

const router = express.Router();

router.get("/", getAllActions);
router.get("/:name", getUserActionByName);

module.exports = router;
