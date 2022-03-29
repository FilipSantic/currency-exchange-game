const asyncHandler = require("express-async-handler");
const Transactions = require("../models/transactionsModel");

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transactions.find();
  res.status(200).json(transactions);
});

const createTransaction = asyncHandler(async (req, res) => {
  if (!req.body.transaction) {
    res.status(400);
    throw new Error("Creating new transaction failed");
  }

  const transaction = await Transactions.create({
    amount: req.body.transaction
  })
  res.status(200).json(transaction);
});

module.exports = {
  getTransactions,
  createTransaction,
};