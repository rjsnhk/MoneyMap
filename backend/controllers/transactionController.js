const Person = require("../models/Person");
const Transaction = require("../models/Transaction");
const xlsx = require("xlsx");

// Helper function to update balance
const updateBalance = async (userId, personName) => {
  const person = await Person.findOne({ userId, name: personName });
  if (!person) return;

  const transactions = await Transaction.find({ userId, person: person._id });

  let balance = 0;
  transactions.forEach((t) => {
    if (t.type === "borrow") balance += t.amount;
    else if (t.type === "spent") balance -= t.amount;
  });

  person.balance = balance;
  await person.save();
};

// Add borrow transaction
const borrowMoney = async (req, res) => {
  const userId = req.user.id;
  const { name, amount, date, description } = req.body;

  try {
    if (!name || !amount || !date) {
      return res.status(400).json({ message: "Name, amount, and date are required" });
    }

    let person = await Person.findOne({ userId, name });
    if (!person) {
      person = await new Person({ userId, name, balance: 0 });
      await person.save();
    }

    const transaction = new Transaction({
      userId,
      person: person._id,
      amount,
      type: "borrow",
      description,
      date: new Date(date),
    });

    await transaction.save();
    await updateBalance(userId, name);

    res.status(201).json({ message: "Borrow recorded", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add spent transaction
const spendMoney = async (req, res) => {
  const userId = req.user.id;
  const { name, amount, date, description } = req.body;

  try {
    if (!name || !amount || !date) {
      return res.status(400).json({ message: "Name, amount, and date are required" });
    }

    // 🔄 If person doesn't exist, create new one (just like in /borrow)
    let person = await Person.findOne({ userId, name });
    if (!person) {
      person = await new Person({ userId, name, balance: 0 });
      await person.save();
    }

    const transaction = new Transaction({
      userId,
      person: person._id,
      amount,
      type: "spent",
      description,
      date: new Date(date),
    });

    await transaction.save();
    await updateBalance(userId, name);

    res.status(201).json({ message: "Spent recorded", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all people and their balances
const getPeople = async (req, res) => {
  const userId = req.user.id;
  try {
    const people = await Person.find({ userId }).sort({ name: 1 });
    res.status(200).json(people);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all transactions (with person details)
const getTransactions = async (req, res) => {
  const userId = req.user.id;
  try {
    const transactions = await Transaction.find({ userId })
      .populate("person")
      .sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({ _id: id, userId }).populate("person");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Transaction.findByIdAndDelete(id);
    await updateBalance(userId, transaction.person.name);

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPersonHistory = async (req, res) => {
  const userId = req.user.id;
  const personName = req.params.name;

  try {
    const person = await Person.findOne({ userId, name: personName });
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const transactions = await Transaction.find({ userId, person: person._id }).sort({ date: -1 });

    res.status(200).json({
      person: person.name,
      balance: person.balance,
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Download Excel of a person’s history
const downloadPersonHistoryExcel = async (req, res) => {
  const userId = req.user.id;
  const personName = req.params.name;

  try {
    const person = await Person.findOne({ userId, name: personName });
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const transactions = await Transaction.find({ userId, person: person._id }).sort({ date: -1 });

    const data = transactions.map((t) => ({
      Type: t.type === "borrow" ? "You Gave" : "You Got Back",
      Amount: t.amount,
      Description: t.description || "",
      Date: t.date.toLocaleDateString(),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, person.name);
    const filename = `${person.name}_Transactions.xlsx`;

    xlsx.writeFile(wb, filename);
    res.download(filename);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  borrowMoney,
  spendMoney,
  getPeople,
  getTransactions,
  deleteTransaction,
  getPersonHistory,
  downloadPersonHistoryExcel
};
