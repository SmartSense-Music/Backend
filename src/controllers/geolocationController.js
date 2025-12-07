const db = require("../config/db");

const saveGeolocation = async (req, res) => {
  // Accept either `clerk_id` or `user_id` from the client; use as user_id in DB
  const { user_id, location_name, lat, lng } = req.body;

  if (!user_id || !lat || !lng) {
    return res
      .status(400)
      .json({
        error: "Clerk ID (user_id), Latitude, and Longitude are required",
      });
  }

  try {
    const insertQuery = `
      INSERT INTO geolocations (user_id, location_name, lat, lng) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const newLocation = await db.query(insertQuery, [
      user_id,
      location_name,
      lat,
      lng,
    ]);
    return res.status(201).json(newLocation.rows[0]);
  } catch (error) {
    console.error("Error saving geolocation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getGeolocationsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM geolocations WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching geolocations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  saveGeolocation,
  getGeolocationsByUser,
};
