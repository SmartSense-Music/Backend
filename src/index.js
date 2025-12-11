const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const environmentRoutes = require("./routes/environmentRoutes");
const timeOfDayRoutes = require("./routes/timeOfDayRoutes");
const userActionRoutes = require("./routes/userActionRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const locationRoutes = require("./routes/locationRoutes");
const musicRoutes = require("./routes/musicRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/environments", environmentRoutes);
app.use("/api/time-of-day", timeOfDayRoutes);
app.use("/api/user-actions", userActionRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/musics", musicRoutes);

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
