const express = require("express");
const router = express.Router();
const geolocationController = require("../controllers/geolocationController");

router.post("/", geolocationController.saveGeolocation);
router.get("/:userId", geolocationController.getGeolocationsByUser);

module.exports = router;
