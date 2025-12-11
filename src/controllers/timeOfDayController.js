const db = require("../config/db");

const getTimeOfDayByName = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await db.query(
      "SELECT * FROM time_of_the_day WHERE name = $1",
      [name]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Time of day not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getLocationByName = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await db.query("SELECT * FROM locations WHERE name = $1", [
      name,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllTimeOfDays = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM time_of_the_day");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getTimeOfDayByName,
  getLocationByName,
  getAllTimeOfDays,
};
