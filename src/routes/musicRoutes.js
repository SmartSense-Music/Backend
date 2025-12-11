const express = require("express");
const { uploadMusic } = require("../controllers/musicController");

const router = express.Router();

router.post("/", uploadMusic);

module.exports = router;
