const mongoose = require("mongoose");

const moneySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    eur: {
      type: Number,
      min: 0,
    },
    usd: {
      type: Number,
      min: 0,
    },
    hrk: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Money", moneySchema);