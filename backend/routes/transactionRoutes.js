const express = require('express')
const router = express.Router()
const { getTransactions, createTransaction } = require('../controllers/transactionsController')

router.route('/').get(getTransactions).post(createTransaction)

module.exports = router