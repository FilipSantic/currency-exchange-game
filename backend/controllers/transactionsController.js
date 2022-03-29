const getTransactions = (req, res) => {
  res.status(200).json({ message: 'Get all transactions'})
}

const createTransaction = (req, res) => {
  if(!req.body.transaction) {
    res.status(400)
    throw new Error('Creating new transaction failed')
  }
  res.status(200).json({ message: 'Create new transaction'})
}

module.exports = {
  getTransactions,
  createTransaction
}