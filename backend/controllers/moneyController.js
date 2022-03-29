const asyncHandler = require("express-async-handler");

const getMoney = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get user money" });
});

const updateMoney = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Update user money" });
});

module.exports = {
  getMoney,
  updateMoney,
};
