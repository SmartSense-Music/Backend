const db = require("../config/db");

const createTables = async () => {
  try {
    console.log("Dropping existing tables...");

    await db.query("DROP TABLE IF EXISTS recommand");
    await db.query("DROP TABLE IF EXISTS user_locations");
    await db.query("DROP TABLE IF EXISTS user_interactions");
    await db.query("DROP TABLE IF EXISTS user_actions");
    await db.query("DROP TABLE IF EXISTS time_of_the_day");
    await db.query("DROP TABLE IF EXISTS environment");
    await db.query("DROP TABLE IF EXISTS locations");
    await db.query("DROP TABLE IF EXISTS musics");
    await db.query("DROP TABLE IF EXISTS interactions");
    await db.query("DROP TABLE IF EXISTS users");

    console.log("Creating tables...");

    // 1. Users Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        clerk_id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255)
      );
    `);
    console.log('Created "users" table');

    // 2. Interactions Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS interactions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
      );
    `);
    console.log('Created "interactions" table');

    // 3. Musics Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS musics (
        id VARCHAR(255) PRIMARY KEY,
        artist VARCHAR(255),
        music VARCHAR(255),
        duration VARCHAR(255),
        url VARCHAR(255)
      );
    `);
    console.log('Created "musics" table');

    // 4. Locations Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        lat VARCHAR(15),
        lan VARCHAR(15)
      );
    `);
    console.log('Created "locations" table');

    // 5. Environment Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS environment (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
      );
    `);
    console.log('Created "environment" table');

    // 6. TimeOfTheDay Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS time_of_the_day (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
      );
    `);
    console.log('Created "time_of_the_day" table');

    // 7. User Actions Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_actions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
      );
    `);
    console.log('Created "user_actions" table');

    // 8. User Interactions Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_interactions (
        user_id VARCHAR(255) REFERENCES users(clerk_id) ON DELETE CASCADE,
        interaction INTEGER REFERENCES interactions(id) ON DELETE CASCADE,
        music_id VARCHAR(255) REFERENCES musics(id) ON DELETE CASCADE
      );
    `);
    console.log('Created "user_interactions" table');

    // 9. User Locations Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_locations (
        user_id VARCHAR(255) REFERENCES users(clerk_id) ON DELETE CASCADE,
        location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE
      );
    `);
    console.log('Created "user_locations" table');

    // 10. Recommand Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS recommand (
        id VARCHAR(255) PRIMARY KEY,
        music VARCHAR(255) REFERENCES musics(id) ON DELETE CASCADE,
        interaction INTEGER REFERENCES interactions(id) ON DELETE CASCADE,
        environment INTEGER REFERENCES environment(id) ON DELETE CASCADE,
        time_of_the_day INTEGER REFERENCES time_of_the_day(id) ON DELETE CASCADE,
        location INTEGER REFERENCES locations(id) ON DELETE CASCADE,
        user_action INTEGER REFERENCES user_actions(id) ON DELETE CASCADE
      );
    `);
    console.log('Created "recommand" table');

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
