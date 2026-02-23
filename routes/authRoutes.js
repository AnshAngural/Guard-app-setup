const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ========================================
// AUTH PAGE ROUTES (GET)
// ========================================

// Render Sign Up Page
router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up" });
});

// Render Login Page
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// ========================================
// AUTH ACTION ROUTES (POST)
// ========================================

// Handle Sign Up
router.post("/signup", authController.signup);

// Handle Login
router.post("/login", authController.login);

// ========================================
// LOGOUT ROUTE
// ========================================

router.get("/logout", authController.logout);

module.exports = router;
