const asyncHandler = require("express-async-handler");
const Transactions = require("../models/transactionsModel");
const Money = require("../models/moneyModel");

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transactions.find({ user: req.user.id });
  res.status(200).json(transactions);
});

const createTransaction = asyncHandler(async (req, res) => {
  if (!req.body.amount || req.body.amount < 0) {
    res.status(400);
    throw new Error("Please add an amount to trade");
  }

  if (req.body.from === req.body.to) {
    res.status(400);
    throw new Error("Please select different currencies to trade");
  }

  const money = await Money.findById(req.user.id);

  if (money[req.body.from] < 1) {
    res.status(400);
    throw new Error("Not enough money");
  }

  const transaction = await Transactions.create({
    user: req.user.id,
    amount: req.body.amount,
    from: req.body.from,
    to: req.body.to,
  });

  res.status(200).json(transaction);
});

module.exports = {
  getTransactions,
  createTransaction,
};