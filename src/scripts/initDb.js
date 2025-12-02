const db = require("../config/db");

const createTables = async () => {
  try {
    console.log("Creating tables...");

    // Users Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created "users" table');

    // Playlists Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS playlists (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        name TEXT,
        tags TEXT[],
        spotify_uri TEXT,
        tracks JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created "playlists" table');

    // Geofences Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS geofences (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        name TEXT,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        radius_m INT
      );
    `);
    console.log('Created "geofences" table');

    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    // Close the pool to allow the script to exit
    // We need to access the pool object directly to end it
    // Assuming db.js exports { query, pool }
    if (db.pool) {
      await db.pool.end();
    }
  }
};

createTables();
