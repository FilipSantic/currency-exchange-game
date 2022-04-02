const asyncHandler = require("express-async-handler");
const Money = require("../models/moneyModel");

const getMoneyFrom = asyncHandler(async (req, res) => {
  const moneyObject = await Money.find({ user: req.user.id });

  if (!moneyObject) {
    res.status(400);
    throw new Error("Money object not found");
  }

  const moneyValue = moneyObject[0][req.body.from];

  if (moneyValue < req.body.amount) {
    res.status(400);
    throw new Error("Not enough money");
  }

  return moneyValue - req.body.amount;
});

const updateMoney = asyncHandler(async (req, res) => {
  const moneyFromValue = await getMoneyFrom(req, res);
  const moneyFromKey = Object.keys(Money.schema.tree).filter(function (e) {
    return e === req.body.from;
  });
  const updatedMoneyFrom = await Money.updateOne(
    { user: req.user.id },
    { $set: { [`${moneyFromKey}`]: moneyFromValue } }
  );
});

module.exports = {
  getMoneyFrom,
  updateMoney,
};