const mongoose = require("mongoose");

const timeOffSchema = new mongoose.Schema({

  guard:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  fromDate: Date,

  toDate: Date,

  reason: String,

  status:{
    type:String,
    enum:["pending","approved","rejected"],
    default:"pending"
  }

},{timestamps:true});

module.exports = mongoose.model("TimeOff",timeOffSchema);
