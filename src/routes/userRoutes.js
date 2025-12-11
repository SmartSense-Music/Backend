const express = require("express");
const { createUserFromClerk } = require("../controllers/userController");

const router = express.Router();

router.post("/create", createUserFromClerk);

module.exports = router;
