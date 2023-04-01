const mongoose = require("mongoose");

const detailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("contact", detailSchema);
