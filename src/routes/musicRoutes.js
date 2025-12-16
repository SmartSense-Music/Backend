const express = require("express");
const {
  uploadMusic,
  recommendMusic,
} = require("../controllers/musicController");

const router = express.Router();

router.post("/", uploadMusic);
router.post("/recommend", recommendMusic);

module.exports = router;
