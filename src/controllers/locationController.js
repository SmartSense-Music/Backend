const db = require("../config/db");

const createLocation = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { name, lat, lan, userId } = req.body;

    console.log("createLocation request:", { name, lat, lan, userId });

    if (!name || !lat || !lan || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await client.query("BEGIN");

    // Check if user exists first to avoid FK violation
    const userCheck = await client.query(
      "SELECT clerk_id FROM users WHERE clerk_id = $1",
      [userId]
    );
    if (userCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      console.log(`User ${userId} not found`);
      return res.status(404).json({ error: "User not found" });
    }

    const result = await client.query(
      "INSERT INTO locations (name, lat, lan) VALUES ($1, $2, $3) RETURNING *",
      [name, lat, lan]
    );

    const locationId = result.rows[0].id;
    console.log("Inserting user_location:", { userId, locationId });

    const userLocationResult = await client.query(
      "INSERT INTO user_locations (user_id, location_id) VALUES ($1, $2) RETURNING *",
      [userId, locationId]
    );

    await client.query("COMMIT");
    console.log("Transaction committed successfully");

    res.status(201).json({
      message: "Location created successfully",
      location: result.rows[0],
      userLocation: userLocationResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction failed, rolled back.", error);
    res.status(500).json({ error: "Server error", details: error.message });
  } finally {
    client.release();
  }
};

const getAllLocationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }

    const query = `
      SELECT l.* 
      FROM locations l
      JOIN user_locations ul ON l.id = ul.location_id
      WHERE ul.user_id = $1
    `;

    const result = await db.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM locations WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createLocation,
  getAllLocationsByUserId,
  deleteLocation,
};
