const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlistController");

router.post("/", playlistController.savePlaylist);
router.get("/", playlistController.getAllPlaylists);

module.exports = router;
