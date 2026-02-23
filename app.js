const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const guardRoutes = require("./routes/guardRoutes");
const { protect, adminOnly } = require("./middleware/protect");

const Timecard = require('./models/Timecard');
const auth = require('./middleware/auth');


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
// SESSION CONFIG
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
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Make user available globally in EJS
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
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  res.render("index", { title: "Guard Portal" });
});

// Protected Dashboard
app.get("/dashboard", protect, (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
});

// Admin Panel (role protected)
app.get("/admin", protect, adminOnly, (req, res) => {
  res.render("admin", { title: "Admin Panel" });
});

// Auth Routes (signup/login/logout)
app.use(authRoutes);

// Guard Routes (schedule, timecard, dayoff)
app.use("/",guardRoutes);


app.post('/clockin', auth, async (req, res) => {
    await Timecard.create({
        user: req.session.userId,
        clockIn: new Date()
    });
    res.redirect('/timecard');
});

app.post('/clockout', auth, async (req, res) => {
    const latest = await Timecard.findOne({
        user: req.session.userId,
        clockOut: null
    }).sort({ createdAt: -1 });

    if (latest) {
        latest.clockOut = new Date();
        await latest.save();
    }

    res.redirect('/timecard');
});

// ==========================
// 404 HANDLER
// ==========================
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// ==========================
// SERVER
// ==========================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Mongo URI:", process.env.MONGO_URI);
  console.log("Server running on port", PORT);
});
