const db = require("../config/db");

const seedData = async () => {
  try {
    console.log("Seeding data...");

    // 1. Environment
    const environments = [
      "Indoor",
      "outdoor",
      "quiet",
      "noicy",
      "bright",
      "dim light",
    ];
    for (const env of environments) {
      const res = await db.query("SELECT id FROM environment WHERE name = $1", [
        env,
      ]);
      if (res.rows.length === 0) {
        await db.query("INSERT INTO environment (name) VALUES ($1)", [env]);
      }
    }
    console.log("Seeded environment");

    // 2. Time of the Day
    const times = [
      "Early Morning",
      "Morning",
      "Afternoon",
      "Evening",
      "Night",
      "Late Night",
    ];
    for (const time of times) {
      const res = await db.query(
        "SELECT id FROM time_of_the_day WHERE name = $1",
        [time]
      );
      if (res.rows.length === 0) {
        await db.query("INSERT INTO time_of_the_day (name) VALUES ($1)", [
          time,
        ]);
      }
    }
    console.log("Seeded time_of_the_day");

    // 3. User Actions
    const actions = ["Walking", "Running", "Stationary", "Commuting"];
    for (const action of actions) {
      const res = await db.query(
        "SELECT id FROM user_actions WHERE name = $1",
        [action]
      );
      if (res.rows.length === 0) {
        await db.query("INSERT INTO user_actions (name) VALUES ($1)", [action]);
      }
    }
    console.log("Seeded user_actions");

    // 4. Interactions
    const interactions = ["skip", "like", "play_full"];
    for (const interaction of interactions) {
      const res = await db.query(
        "SELECT id FROM interactions WHERE name = $1",
        [interaction]
      );
      if (res.rows.length === 0) {
        await db.query("INSERT INTO interactions (name) VALUES ($1)", [
          interaction,
        ]);
      }
    }
    console.log("Seeded interactions");

    console.log("Data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    if (db.pool) {
      await db.pool.end();
    }
  }
};

seedData();
