const express = require('express');
const { addIncome, getAllIncomes, deleteIncome, downloadIncomesExcel} = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');
const incomeRouter = express.Router();

// Route to add a new income
incomeRouter.post('/add',protect, addIncome);
// Route to get all incomes
incomeRouter.get('/get',protect, getAllIncomes);


// Route to delete a specific income by ID
incomeRouter.delete('/:id', protect, deleteIncome);

// Route to download all incomes as an Excel file
incomeRouter.get('/download', protect, downloadIncomesExcel);

module.exports = incomeRouter;