// app.js

const express = require("express");
const path = require("path");
const morgan = require("morgan"); // logger
const dotenv = require("dotenv");

dotenv.config(); // load .env

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(morgan("dev")); // request logging
app.use(express.static(path.join(__dirname, "public"))); // static files

// =====================
// ROUTES
// =====================
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Example API route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

// =====================
// ERROR HANDLING
// =====================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// =====================
// SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
