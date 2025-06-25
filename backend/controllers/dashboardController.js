const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { Types } = require('mongoose');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(userId);

    // Total income
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Total expense
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Income from last 60 days
    const last60DaysIncomeTransaction = await Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransaction.reduce(
      (total, txn) => total + txn.amount,
      0
    );

    // Expense from last 30 days
    const last30DaysExpenseTransaction = await Expense.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    const expenseLast30Days = last30DaysExpenseTransaction.reduce(
      (total, txn) => total + txn.amount,
      0
    );

    // Last 5 transactions (income + expense)
    const lastTransactions = [
      ...(await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(txn => ({
        ...txn.toObject(),
        type: 'income'
      })),
      ...(await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(txn => ({
        ...txn.toObject(),
        type: 'expense'
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysExpense: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransaction
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransaction
      },
      lastTransactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardData };
