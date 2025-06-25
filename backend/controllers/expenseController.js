const xlsx = require('xlsx');
const expenseModel = require('../models/Expense');

// Function to add a new expense
const addExpense = async (req, res) => {
    const userId= req.user.id;
    try {
        const { icon, category, amount, date, description } = req.body;

        if(!category || !amount || !date) {
            return res.status(400).json({ message: 'Source and amount and date are required' });
        }

        const newExpense = new expenseModel({
            userId,
            icon,
            category,
            amount,
            date: new Date(date), // Ensure date is stored as a Date object
            description
        });

        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while adding expense' });
        }
}

const getAllExpenses = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await expenseModel.find({userId}).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching expenses' });
    }
}


// Function to delete an expense by ID
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const Expense = await expenseModel.findByIdAndDelete(id);
    if (!Expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const downloadExpensesExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 }); // Sort by date in descending order
        
        const data = expenses.map(expense => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date,
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Expenses');
        xlsx.writeFile(wb, 'Expenses_List.xlsx');
        res.download('Expenses_List.xlsx');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while downloading expenses' });
    }
}


module.exports = {
    addExpense,
    getAllExpenses,
    deleteExpense,
    downloadExpensesExcel

}