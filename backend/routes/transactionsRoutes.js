const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
} = require("../controllers/transactionsController");

const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getTransactions)
  .post(protect, createTransaction);

module.exports = router;