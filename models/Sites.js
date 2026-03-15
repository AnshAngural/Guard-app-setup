const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  guards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

},{ timestamps:true });

module.exports = mongoose.model("Site", siteSchema);
