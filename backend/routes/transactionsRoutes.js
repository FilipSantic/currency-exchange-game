const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getTransactions,
  createTransaction,
} = require("../controllers/transactionsController");

router
  .route("/")
  .get(protect, getTransactions)
  .post(protect, createTransaction);

module.exports = router;