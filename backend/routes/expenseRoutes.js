const express = require('express');
const {addExpense, getAllExpenses, deleteExpense, downloadExpensesExcel} = require("../controllers/expenseController");
const expenseRouter = express.Router();
const {protect} = require("../middleware/authMiddleware");

expenseRouter.post("/add" ,protect, addExpense);
expenseRouter.get("/get" ,  protect, getAllExpenses);
expenseRouter.get("/download" ,  protect, downloadExpensesExcel);
expenseRouter.delete('/:id' ,protect, deleteExpense);

module.exports = expenseRouter;