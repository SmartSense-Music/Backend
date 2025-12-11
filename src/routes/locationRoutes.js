const express = require("express");
const {
  createLocation,
  getAllLocationsByUserId,
  deleteLocation,
} = require("../controllers/locationController");

const router = express.Router();

router.post("/", createLocation);
router.delete("/:id", deleteLocation);
router.get("/:userId", getAllLocationsByUserId);

module.exports = router;
