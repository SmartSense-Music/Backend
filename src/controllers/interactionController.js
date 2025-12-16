const db = require("../config/db");

const getInteractionByName = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await db.query(
      "SELECT * FROM interactions WHERE name = $1",
      [name]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Interaction not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Record or increment a user's interaction with a playlist/music
const recordInteraction = async (req, res) => {
  try {
    const { user_id, playlist_id } = req.body || {};
    if (!user_id || !playlist_id) {
      return res.status(400).json({ error: "Missing user_id or playlist_id" });
    }

    // Check if a record exists
    const existing = await db.query(
      "SELECT count FROM user_interactions WHERE user_id = $1 AND music_id = $2",
      [user_id, playlist_id]
    );

    if (existing.rows.length > 0) {
      const current = existing.rows[0].count || 0;
      if (current > 0) {
        // Already liked -> unlike by setting count to 0
        await db.query(
          "UPDATE user_interactions SET count = 0 WHERE user_id = $1 AND music_id = $2",
          [user_id, playlist_id]
        );
        return res.status(200).json({ success: true, liked: false });
      } else {
        // Not liked -> set to liked (1)
        await db.query(
          "UPDATE user_interactions SET count = 1 WHERE user_id = $1 AND music_id = $2",
          [user_id, playlist_id]
        );
        return res.status(200).json({ success: true, liked: true });
      }
    } else {
      // Insert new record with count 1 for the like
      await db.query(
        "INSERT INTO user_interactions (user_id, music_id, count) VALUES ($1, $2, $3)",
        [user_id, playlist_id, 1]
      );
      return res.status(200).json({ success: true, liked: true });
    }
  } catch (error) {
    console.error("recordInteraction error:", error);
    res.status(500).json({ error: "Failed to record interaction" });
  }
};

module.exports = {
  getInteractionByName,
  recordInteraction,
};
