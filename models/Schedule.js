const mongoose = require('mongoose');


const scheduleSchema = new mongoose.Schema({
guard: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
date: Date,
shift: String,
location: String
});


module.exports = mongoose.model('Schedule', scheduleSchema);