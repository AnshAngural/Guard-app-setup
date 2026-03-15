const User      = require("../models/user");
const rateLimit = require("express-rate-limit");

// ==========================
// RATE LIMITER
// ==========================
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    return res.render("login", {
      error: "Too many login attempts. Please wait 15 minutes and try again.",
      email: "",
    });
  },
});

// ==========================
// SANITIZE — strips $ only, NOT dots
// ==========================
function sanitize(obj) {
  const clean = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      clean[key] = obj[key].replace(/\$/g, "").trim(); // only strip $, never dots
    } else {
      clean[key] = obj[key];
    }
  }
  return clean;
}

// ==========================
// SIGNUP
// ==========================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = sanitize(req.body);

    if (!name || !email || !password) {
      return res.render("signup", {
        error: "All fields are required.",
        name:  name  || "",
        email: email || "",
      });
    }

    if (name.length < 2) {
      return res.render("signup", {
        error: "Name must be at least 2 characters.",
        name, email,
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.render("signup", {
        error: "Please enter a valid email address.",
        name, email,
      });
    }

    if (password.length < 6) {
      return res.render("signup", {
        error: "Password must be at least 6 characters.",
        name, email,
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("signup", {
        error: "An account with that email already exists.",
        name:  "",
        email: "",
      });
    }

    const user = await User.create({ name, email, password });

    req.session.userId = user._id;
    req.session.user   = {
      _id:  user._id,
      name: user.name,
      role: user.role,
    };

    res.redirect("/dashboard");

  } catch (error) {
    console.error("Signup error:", error);
    const message = error.errors
      ? Object.values(error.errors)[0].message
      : "Something went wrong. Please try again.";

    res.render("signup", {
      error:   message,
      name:    req.body.name  || "",
      email:   req.body.email || "",
    });
  }
};

// ==========================
// LOGIN
// ==========================
exports.login = async (req, res) => {
  try {
    const { email, password } = sanitize(req.body);

    if (!email || !password) {
      return res.render("login", {
        error: "Email and password are required.",
        email: email || "",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        error: "Invalid email or password.",
        email: "",
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.render("login", {
        error: "Invalid email or password.",
        email: "",
      });
    }

    req.session.userId = user._id;
    req.session.user   = {
      _id:  user._id,
      name: user.name,
      role: user.role,
    };

    if (user.role === "admin") return res.redirect("/admin");
    res.redirect("/dashboard");

  } catch (error) {
    console.error("Login error:", error);
    res.render("login", {
      error: "Something went wrong. Please try again.",
      email: req.body.email || "",
    });
  }
};

// ==========================
// LOGOUT
// ==========================
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Session destroy error:", err);
    res.redirect("/");
  });
};

// ==========================
// EXPORT LIMITER
// ==========================
exports.loginLimiter = loginLimiter;