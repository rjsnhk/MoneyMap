const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  person: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["borrow", "spent"], required: true },
  description: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
