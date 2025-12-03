const db = require("../config/db");

const savePlaylist = async (req, res) => {
  const { title, artist, url, duration, environment, timeOfDay, location } =
    req.body;

  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required" });
  }

  try {
    const insertQuery = `
      INSERT INTO playlists (title, artist, url, duration, environment, time_of_day, location) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    const values = [
      title,
      artist,
      url,
      duration,
      environment,
      timeOfDay,
      location,
    ];

    const newPlaylist = await db.query(insertQuery, values);
    return res.status(201).json(newPlaylist.rows[0]);
  } catch (error) {
    console.error("Error saving playlist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPlaylists = async (req, res) => {
  try {
    const { environment, timeOfDay, location } = req.query;

    let query;
    let params = [];

    if (environment || timeOfDay || location) {
      // Scoring logic:
      // Environment match: 3 points
      // Time of Day match: 2 points
      // Location match: 1 point
      query = `
        SELECT *,
        (
          (CASE WHEN $1::text = ANY(environment) THEN 3 ELSE 0 END) +
          (CASE WHEN $2::text = ANY(time_of_day) THEN 2 ELSE 0 END) +
          (CASE WHEN location = $3 THEN 1 ELSE 0 END)
        ) as relevance_score
        FROM playlists
        ORDER BY relevance_score DESC, created_at DESC
      `;
      params = [environment || null, timeOfDay || null, location || null];
    } else {
      query = "SELECT * FROM playlists ORDER BY created_at DESC";
    }

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  savePlaylist,
  getAllPlaylists,
};
