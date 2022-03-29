const getTransactions = (req, res) => {
  res.status(200).json({ message: 'Get all transactions'})
}

const createTransaction = (req, res) => {
  res.status(200).json({ message: 'Create new transaction'})
}

module.exports = {
  getTransactions,
  createTransaction
}