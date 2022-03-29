const getMoney = (req, res) => {
  res.status(200).json({ message: 'Get user money'})
}

const updateMoney = (req, res) => {
  res.status(200).json({ message: 'Update user money'})
}

module.exports = {
  getMoney,
  updateMoney
}