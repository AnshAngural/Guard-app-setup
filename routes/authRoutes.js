const express        = require("express");
const router         = express.Router();
const authController = require("../controllers/authController");

router.get("/signup", (req, res) => res.render("signup", { error: null, name: "", email: "" }));
router.get("/login",  (req, res) => res.render("login",  { error: null, email: "" }));

router.post("/signup", authController.signup);
router.post("/login",  authController.loginLimiter, authController.login); // rate limiter here
router.get("/logout",  authController.logout);

module.exports = router;