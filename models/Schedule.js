const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  guard:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  removedDays: [{ type: String }], // array of "YYYY-MM-DD" strings for approved days off
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);