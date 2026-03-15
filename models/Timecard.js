const mongoose = require('mongoose');

const timecardSchema = new mongoose.Schema({
  guard:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:        { type: String, required: true }, // "YYYY-MM-DD" — one record per guard per day
  clockIn:     { type: Date },
  clockOut:    { type: Date },
  hoursWorked: { type: Number, default: 0 },     // calculated on clock-out
}, { timestamps: true });

// Prevent duplicate clock-in for same guard on same day
timecardSchema.index({ guard: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Timecard', timecardSchema);