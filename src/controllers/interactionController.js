const db = require("../config/db");

const getInteractionByName = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await db.query(
      "SELECT * FROM interactions WHERE name = $1",
      [name]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Interaction not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getInteractionByName,
};
