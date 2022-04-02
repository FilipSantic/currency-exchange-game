const asyncHandler = require("express-async-handler");
const Transactions = require("../models/transactionsModel");
const { getMoney, updateMoney } = require("../controllers/moneyController");

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transactions.find({ user: req.user.id });
  res.status(200).json(transactions);
});

const createTransaction = asyncHandler(async (req, res) => {
  if (!req.body.amount || req.body.amount < 1) {
    res.status(400);
    throw new Error("Please add an amount to trade");
  }

  if (req.body.from === req.body.to) {
    res.status(400);
    throw new Error("Please select different currencies to trade");
  }

  await updateMoney(req, res);

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