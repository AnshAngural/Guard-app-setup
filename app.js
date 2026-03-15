const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const guardRoutes = require("./routes/guardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { protect } = require("./middleware/protect");
const app = express();

// ==========================
// DATABASE
// ==========================
connectDB();

// ==========================
// MIDDLEWARE
// ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// ==========================
// SESSION
// ==========================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Make user available in all EJS views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ==========================
// VIEW ENGINE
// ==========================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// ==========================
// ROUTES
// ==========================

// Home
app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.render("index", { title: "Guard Portal" });
});

// Dashboard
app.get("/dashboard", protect, (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
});

// Auth (signup / login / logout)
app.use(authRoutes);

// Guard routes (schedule, timecard, dayoff)
app.use("/", guardRoutes);

// Admin routes
app.use("/", adminRoutes);

// ==========================
// 404
// ==========================
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// ==========================
// SERVER
// ==========================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});