const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

personSchema.index({ userId: 1, name: 1 }, { unique: true }); // To avoid duplicate names per user

module.exports = mongoose.model("Person", personSchema);
