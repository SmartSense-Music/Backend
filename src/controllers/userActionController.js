const db = require("../config/db");

const getUserActionByName = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await db.query(
      "SELECT * FROM user_actions WHERE name = $1",
      [name]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User action not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllActions = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM user_actions");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getUserActionByName,
  getAllActions,
};
