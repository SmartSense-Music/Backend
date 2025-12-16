const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const uploadMusic = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const {
      title,
      artist,
      url,
      duration,
      environment,
      timeOfDay,
      location,
      action,
      userId,
    } = req.body;
    console.log("uploadMusic request:", {
      title,
      artist,
      url,
      duration,
      environment,
      timeOfDay,
      location,
      action,
      userId,
    });

    if (!title || !artist || !url || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await client.query("BEGIN");

    // 1. Insert into musics table
    const musicId = uuidv4();
    await client.query(
      "INSERT INTO musics (id, artist, music, duration, url) VALUES ($1, $2, $3, $4, $5)",
      [musicId, artist, title, duration, url]
    );

    // 2. Find IDs for metadata
    // Environment
    let environmentId = null;
    if (environment) {
      const envResult = await client.query(
        "SELECT id FROM environment WHERE name = $1",
        [environment]
      );
      if (envResult.rows.length > 0) {
        environmentId = envResult.rows[0].id;
      } else {
        const newEnvResult = await client.query(
          "INSERT INTO environment (name) VALUES ($1) RETURNING id",
          [environment]
        );
        environmentId = newEnvResult.rows[0].id;
      }
    }

    // Time of Day
    let timeOfDayId = null;
    if (timeOfDay) {
      const timeResult = await client.query(
        "SELECT id FROM time_of_the_day WHERE name = $1",
        [timeOfDay]
      );
      if (timeResult.rows.length > 0) {
        timeOfDayId = timeResult.rows[0].id;
      } else {
        const newTimeResult = await client.query(
          "INSERT INTO time_of_the_day (name) VALUES ($1) RETURNING id",
          [timeOfDay]
        );
        timeOfDayId = newTimeResult.rows[0].id;
      }
    }

    // User Action
    let userActionId = null;
    if (action) {
      const actionResult = await client.query(
        "SELECT id FROM user_actions WHERE name = $1",
        [action]
      );
      if (actionResult.rows.length > 0) {
        userActionId = actionResult.rows[0].id;
      } else {
        const newActionResult = await client.query(
          "INSERT INTO user_actions (name) VALUES ($1) RETURNING id",
          [action]
        );
        userActionId = newActionResult.rows[0].id;
      }
    }

    // Location
    let locationId = null;
    if (location) {
      const locResult = await client.query(
        "SELECT id FROM locations WHERE name = $1",
        [location]
      );
      if (locResult.rows.length > 0) {
        locationId = locResult.rows[0].id;
      } else {
        // Create new location with auto-increment ID
        const newLocResult = await client.query(
          "INSERT INTO locations (name, lat, lan) VALUES ($1, $2, $3) RETURNING id",
          [location, null, null]
        );
        locationId = newLocResult.rows[0].id;
      }
    }

    // 3. Insert into recommand table
    const recommandId = uuidv4();
    await client.query(
      `INSERT INTO recommand (
        id, 
        music, 
        environment, 
        time_of_the_day, 
        location, 
        user_action
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        recommandId,
        musicId,
        environmentId,
        timeOfDayId,
        locationId,
        userActionId,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Music uploaded and metadata saved successfully",
      musicId: musicId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Upload music transaction error:", error);
    res.status(500).json({ error: "Failed to save music data" });
  } finally {
    client.release();
  }
};

const recommendMusic = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { environment, timeOfDay, location, action, limit, user } =
      req.body || {};

    const query = `
      SELECT
        m.id,
        m.artist,
        m.music AS title,
        m.duration,
        m.url,
        (
          (CASE WHEN e.name = $1 THEN 1 ELSE 0 END)
          + (CASE WHEN t.name = $2 THEN 1 ELSE 0 END)
          + (CASE WHEN l.name = $3 THEN 1 ELSE 0 END)
          + (CASE WHEN ua.name = $4 THEN 1 ELSE 0 END)
          + (CASE WHEN ui.count > 0 THEN 1 ELSE 0 END)
        ) AS score
      FROM recommand r
      JOIN musics m ON r.music = m.id
      LEFT JOIN environment e ON r.environment = e.id
      LEFT JOIN time_of_the_day t ON r.time_of_the_day = t.id
      LEFT JOIN locations l ON r.location = l.id
      LEFT JOIN user_actions ua ON r.user_action = ua.id
      LEFT JOIN user_interactions ui ON ui.music_id = m.id AND ui.user_id = $6
      ORDER BY score DESC
      LIMIT $5
    `;

    const params = [environment, timeOfDay, location, action, limit, user];
    const result = await client.query(query, params);

    let recommendations = result.rows;

    const hasMatch = recommendations.some((r) => r.score > 0);
    if (!hasMatch) {
      const fallback = await client.query(
        `SELECT m.id, m.artist, m.music AS title, m.duration, m.url, 0 AS score
         FROM musics m
         ORDER BY random()
         LIMIT $1`,
        [limit]
      );
      recommendations = fallback.rows;
    }

    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    console.error("recommendMusic error:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  } finally {
    client.release();
  }
};

module.exports = {
  uploadMusic,
  recommendMusic,
};
