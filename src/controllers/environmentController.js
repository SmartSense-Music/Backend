const db = require("../config/db");

const getEnvironmentByName = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await db.query("SELECT * FROM environment WHERE name = $1", [
      name,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Environment not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllEnvironments = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM environment");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getEnvironmentByName,
  getAllEnvironments,
};
