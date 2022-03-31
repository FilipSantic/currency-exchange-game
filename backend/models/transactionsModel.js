const mongoose = require("mongoose");

const transactionsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: [true, "Please insert an amount of money you want to trade"],
      min: 1,
    },
    from: {
      type: String,
      enum: ["eur", "usd", "hrk"],
      required: [true, "Please select currency from which to trade"],
    },
    to: {
      type: String,
      enum: ["eur", "usd", "hrk"],
      required: [true, "Please select currency in which to trade"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transactions", transactionsSchema);