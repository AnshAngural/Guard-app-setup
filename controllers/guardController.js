const TimeOff  = require("../models/TimeOff");
const Timecard = require("../models/Timecard");
const Schedule = require("../models/Schedule");

// Helper — "YYYY-MM-DD" for today in local time
function todayStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// Helper — get the Mon–Fri dates for the current week
function getWeekDays() {
  const now  = new Date();
  const day  = now.getDay(); // 0=Sun, 1=Mon...
  const mon  = new Date(now);
  mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  mon.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    days.push(d);
  }
  return days;
}

// ── Schedule ──────────────────────────────────────────
exports.getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ guard: req.user._id });
    const removedDays = schedule ? schedule.removedDays : [];
    const weekDays    = getWeekDays();

    res.render("schedule", { weekDays, removedDays });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ── Day Off ───────────────────────────────────────────
exports.getDayOff = async (req, res) => {
  try {
    const requests = await TimeOff.find({ guard: req.user._id }).sort({ createdAt: -1 });
    res.render("dayoff", { requests });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.submitDayOff = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;

    if (!fromDate) return res.status(400).send("fromDate is required");

    const parsedFrom = new Date(fromDate);
    const parsedTo   = toDate ? new Date(toDate) : parsedFrom;

    await TimeOff.create({
      guard:    req.user._id,
      fromDate: parsedFrom,
      toDate:   parsedTo,
      reason:   reason || "",
    });

    res.redirect("/dayoff");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ── Timecard ──────────────────────────────────────────
exports.getTimecard = async (req, res) => {
  try {
    const today   = todayStr();
    const record  = await Timecard.findOne({ guard: req.user._id, date: today });
    const history = await Timecard.find({ guard: req.user._id, clockOut: { $ne: null } })
                                  .sort({ date: -1 })
                                  .limit(14);

    res.render("timecard", { record, history, today });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.clockIn = async (req, res) => {
  try {
    const today = todayStr();

    // Prevent double clock-in on same day
    const existing = await Timecard.findOne({ guard: req.user._id, date: today });
    if (existing) return res.redirect("/timecard");

    await Timecard.create({
      guard:   req.user._id,
      date:    today,
      clockIn: new Date(),
    });

    res.redirect("/timecard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.clockOut = async (req, res) => {
  try {
    const today  = todayStr();
    const record = await Timecard.findOne({ guard: req.user._id, date: today });

    if (!record || !record.clockIn) return res.redirect("/timecard");
    if (record.clockOut)            return res.redirect("/timecard"); // already clocked out

    const clockOut     = new Date();
    const msWorked     = clockOut - record.clockIn;
    const hoursWorked  = parseFloat((msWorked / (1000 * 60 * 60)).toFixed(2));

    record.clockOut    = clockOut;
    record.hoursWorked = hoursWorked;
    await record.save();

    res.redirect("/timecard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};