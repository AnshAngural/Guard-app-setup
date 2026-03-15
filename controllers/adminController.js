const User     = require("../models/user");
const Site     = require("../models/Sites");
const TimeOff  = require("../models/TimeOff");
const Schedule = require("../models/Schedule");
const Timecard = require("../models/Timecard");

// ── Dashboard ─────────────────────────────────────────
exports.dashboard = async (req, res) => {
  try {
    const guards   = await User.countDocuments({ role: "guard" });
    const sites    = await Site.countDocuments();
    const requests = await TimeOff.countDocuments({ status: "pending" });
    res.render("admin", { guards, sites, requests });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ── Guards list ───────────────────────────────────────
exports.getGuards = async (req, res) => {
  try {
    const guards = await User.find({ role: "guard" }).select("name email createdAt");
    res.render("admin-guards", { guards });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ── Guard timecard detail ─────────────────────────────
exports.getGuardTimecard = async (req, res) => {
  try {
    const guard    = await User.findById(req.params.id).select("name email");
    if (!guard) return res.status(404).send("Guard not found");

    const timecards = await Timecard.find({ guard: req.params.id })
                                    .sort({ date: -1 })
                                    .limit(30);

    const totalHours = timecards.reduce((sum, t) => sum + (t.hoursWorked || 0), 0);

    res.render("admin-guard-timecard", { guard, timecards, totalHours: totalHours.toFixed(2) });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ── Delete guard ──────────────────────────────────────
exports.deleteGuard = async (req, res) => {
  try {
    const { id } = req.params;

    // Remove from all sites
    await Site.updateMany({}, { $pull: { guards: id } });

    // Clean up related records
    await TimeOff.deleteMany({ guard: id });
    await Timecard.deleteMany({ guard: id });
    await Schedule.deleteOne({ guard: id });

    // Delete the user
    await User.findByIdAndDelete(id);

    res.redirect("/admin/guards");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ── Sites ─────────────────────────────────────────────
exports.getSites = async (req, res) => {
  try {
    const sites  = await Site.find().populate("guards", "name email");
    const guards = await User.find({ role: "guard" }).select("name email");
    res.render("admin-sites", { sites, guards });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.createSite = async (req, res) => {
  try {
    const { name, address } = req.body;
    await Site.create({ name, address });
    res.redirect("/admin/sites");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.assignGuard = async (req, res) => {
  try {
    const { siteId, guardId } = req.body;
    await Site.findByIdAndUpdate(siteId, { $addToSet: { guards: guardId } });
    res.redirect("/admin/sites");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ── Delete site ───────────────────────────────────────
exports.deleteSite = async (req, res) => {
  try {
    await Site.findByIdAndDelete(req.params.id);
    res.redirect("/admin/sites");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ── Remove guard from site ────────────────────────────
exports.removeGuardFromSite = async (req, res) => {
  try {
    const { siteId, guardId } = req.body;
    await Site.findByIdAndUpdate(siteId, { $pull: { guards: guardId } });
    res.redirect("/admin/sites");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ── Time off requests ─────────────────────────────────
exports.timeOffRequests = async (req, res) => {
  try {
    const requests = await TimeOff.find()
      .populate("guard", "name email")
      .sort({ createdAt: -1 });
    res.render("admin-requests", { requests });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).send("Invalid status");
    }

    const request = await TimeOff.findByIdAndUpdate(id, { status }, { new: true });

    if (status === "approved" && request) {
      const from = new Date(request.fromDate);
      const to   = new Date(request.toDate);
      const days = [];
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        days.push(d.toISOString().split("T")[0]);
      }
      await Schedule.findOneAndUpdate(
        { guard: request.guard },
        { $addToSet: { removedDays: { $each: days } } },
        { upsert: true }
      );
    }

    if (status === "rejected" && request) {
      const from = new Date(request.fromDate);
      const to   = new Date(request.toDate);
      const days = [];
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        days.push(d.toISOString().split("T")[0]);
      }
      await Schedule.findOneAndUpdate(
        { guard: request.guard },
        { $pull: { removedDays: { $in: days } } }
      );
    }

    res.redirect("/admin/requests");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};