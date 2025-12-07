const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const playlistRoutes = require("./routes/playlistRoutes");
const geolocationRoutes = require("./routes/geolocationRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/playlists", playlistRoutes);
app.use("/api/geolocations", geolocationRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World! Node.js Backend is running.");
});

// Test DB Connection Route
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      message: "Database connection successful",
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database connection failed",
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
