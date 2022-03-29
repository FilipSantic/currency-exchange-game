const mongoose = require("mongoose");

const transactionsSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Please insert an amount of money you want to trade"],
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transactions", transactionsSchema);