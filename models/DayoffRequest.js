const mongoose = require('mongoose');


const dayOffSchema = new mongoose.Schema({
guard: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
date: Date,
reason: String,
status: { type: String, default: 'pending' }
});


module.exports = mongoose.model('DayOffRequest', dayOffSchema);