const express = require("express");
const transactionRouter = express.Router();

const {
  borrowMoney,
  spendMoney,
  getPeople,
  getTransactions,
  deleteTransaction,
  getPersonHistory,              // ✅ NEW
  downloadPersonHistoryExcel,   // ✅ NEW
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");

// 🧾 Main routes
transactionRouter.post("/borrow", protect, borrowMoney);
transactionRouter.post("/spent", protect, spendMoney);
transactionRouter.get("/get_people", protect, getPeople);
transactionRouter.get("/get_transactions", protect, getTransactions);
transactionRouter.delete("/:id", protect, deleteTransaction);

// 📜 NEW: Get full history of one person
transactionRouter.get("/person/history/:name", protect, getPersonHistory);

// 📥 NEW: Download that person’s history as Excel
transactionRouter.get("/person/download/:name", protect, downloadPersonHistoryExcel);

module.exports = transactionRouter;
