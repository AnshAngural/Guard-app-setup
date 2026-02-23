const mongoose = require('mongoose');


const timecardSchema = new mongoose.Schema({
guard: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
clockIn: Date,
clockOut: Date
});


module.exports = mongoose.model('Timecard', timecardSchema);