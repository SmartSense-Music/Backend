const express = require("express");
const { createUserFromClerk } = require("../controllers/userController");

const router = express.Router();

// Endpoint to create user from Clerk (call this after sign-up on mobile app)
router.post("/create", createUserFromClerk);

module.exports = router;
