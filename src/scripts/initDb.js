const db = require("../config/db");

const createTables = async () => {
  try {
    console.log("Dropping existing tables...");
    // Drop tables in order of dependency
    await db.query("DROP TABLE IF EXISTS geolocations");
    await db.query("DROP TABLE IF EXISTS geofences");
    await db.query("DROP TABLE IF EXISTS playlists");
    await db.query("DROP TABLE IF EXISTS users");

    console.log("Creating tables...");

    // Geolocations Table (No foreign key to users)
    await db.query(`
      CREATE TABLE IF NOT EXISTS geolocations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT,
        location_name TEXT,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created "geolocations" table');

    // Playlists Table (Stores music metadata)
    // Based on the payload: {"artist": "Test", "duration": 243.696327, "environment": [...], "location": "Unknown", "timeOfDay": [...], "title": "...", "url": "..."}
    await db.query(`
      CREATE TABLE IF NOT EXISTS playlists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT,
        artist TEXT,
        url TEXT,
        duration DOUBLE PRECISION,
        environment TEXT[],
        time_of_day TEXT[],
        location TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created "playlists" table');

    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    if (db.pool) {
      await db.pool.end();
    }
  }
};

createTables();
