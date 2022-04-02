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
    base: {
      type: String,
      enum: ["eur", "usd", "gbp", "aud", "hrk"],
      required: [true, "Please select base currency"],
    },
    target: {
      type: String,
      enum: ["eur", "usd", "gbp", "aud", "hrk"],
      required: [true, "Please select target currency"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transactions", transactionsSchema);