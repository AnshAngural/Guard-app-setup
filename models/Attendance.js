const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

  guard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Site"
  },

  clockIn: Date,

  clockOut: Date

},
{ timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
