const db = require("../config/db");

// Handle user creation by fetching from Clerk using access token
const createUserFromClerk = async (req, res) => {
  try {
    const { userId, emailAddress } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request body" });
    }

    if (!emailAddress) {
      return res
        .status(400)
        .json({ error: "Missing emailAddress in request body" });
    }

    const clerkId = userId;
    const email = emailAddress;

    if (!clerkId || !email) {
      return res
        .status(400)
        .json({ error: "Unable to extract email from Clerk user" });
    }

    // Insert user into database with created_at timestamp
    await db.query(
      "INSERT INTO users (clerk_id, email) VALUES ($1, $2) ON CONFLICT (clerk_id) DO NOTHING",
      [clerkId, email]
    );

    console.log(`User created: ${clerkId} (${email})`);
    res.json({
      success: true,
      message: "User added to database",
      user: { clerk_id: clerkId, email },
    });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

module.exports = {
  createUserFromClerk,
};
