const xlsx = require("xlsx");

const Income = require('../models/Income');

// Function to add a new income
const addIncome = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  
  
  try {
  const {icon, source, amount, date, description} = req.body;

  if (!source || !amount || !date) {
    return res.status(400).json({ message: 'Source and amount and date are required' });
  }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date), // Ensure date is stored as a Date object
      description
    });

    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Function to get all incomes
const getAllIncomes = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 }); // Sort by date in descending order
    res.status(200).json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};





// Function to delete a specific income by ID
const deleteIncome = async (req, res) => {
  const { id } = req.params;
  try {
    const income = await Income.findByIdAndDelete(id);
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to download all incomes as an Excel file
const downloadIncomesExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 }); // Sort by date in descending order
    
    const data= incomes.map(income => ({
      Source: income.source,
      Amount: income.amount,
      Date: income.date,
    }));
    const wb=xlsx.utils.book_new();
    const ws=xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb,ws,"Incomes");
    xlsx.writeFile(wb,"Incomes_List.xlsx");
    res.download("Incomes_List.xlsx");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Exporting the functions
module.exports = {
  addIncome,
  getAllIncomes,
  deleteIncome,
  downloadIncomesExcel
};