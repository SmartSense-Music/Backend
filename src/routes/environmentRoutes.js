const express = require("express");
const {
  getEnvironmentByName,
  getAllEnvironments,
} = require("../controllers/environmentController");

const router = express.Router();

router.get("/", getAllEnvironments);
router.get("/:name", getEnvironmentByName);

module.exports = router;
