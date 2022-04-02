const asyncHandler = require("express-async-handler");
const Money = require("../models/moneyModel");
const axios = require("axios");

const updateMoney = asyncHandler(async (req, res) => {
  const moneyFromValue = await getMoneyFrom(req, res);
  const moneyToValueBefore = await getMoneyTo(req, res);
  const moneyToNewValue = await convertMoneyTo(req, res);
  const moneyToValueAfter = moneyToValueBefore + Number(moneyToNewValue);

  const moneyFromKey = Object.keys(Money.schema.tree).filter(function (
    fromKey
  ) {
    return fromKey === req.body.from;
  });

  const moneyToKey = Object.keys(Money.schema.tree).filter(function (toKey) {
    return toKey === req.body.to;
  });

  const updatedMoney = await Money.updateOne(
    { user: req.user.id },
    {
      $set: {
        [`${moneyFromKey}`]: moneyFromValue,
        [`${moneyToKey}`]: moneyToValueAfter,
      },
    }
  );
});

const getMoneyFrom = asyncHandler(async (req, res) => {
  const moneyObject = await Money.find({ user: req.user.id });

  if (!moneyObject) {
    res.status(400);
    throw new Error("Money object not found");
  }

  const moneyFromValue = moneyObject[0][req.body.from];

  if (moneyFromValue < req.body.amount) {
    res.status(400);
    throw new Error("Not enough money");
  }

  return moneyFromValue - req.body.amount;
});

const getMoneyTo = asyncHandler(async (req, res) => {
  const moneyObject = await Money.find({ user: req.user.id });

  if (!moneyObject) {
    res.status(400);
    throw new Error("Money object not found");
  }

  return moneyObject[0][req.body.to];
});

const convertMoneyTo = asyncHandler(async (req, res) => {
  const moneyObject = await Money.find({ user: req.user.id });

  if (!moneyObject) {
    res.status(400);
    throw new Error("Money object not found");
  }

  const moneyToKey = Object.keys(Money.schema.tree).filter(function (toKey) {
    return toKey === req.body.to;
  });

  const moneyFromKey = Object.keys(Money.schema.tree).filter(function (
    fromKey
  ) {
    return fromKey === req.body.from;
  });

  const apiString = `https://api.getgeoapi.com/v2/currency/convert?api_key=${process.env.CURRENCY_API_KEY}&from=${moneyFromKey}&to=${moneyToKey}&amount=${req.body.amount}&format=json`;

  try {
    const response = await axios.get(apiString);

    return response.data.rates[moneyToKey.toString().toUpperCase()]
      .rate_for_amount;
  } catch (err) {
    throw new Error("Unexpected error happened");
  }
});

module.exports = {
  updateMoney,
  getMoneyFrom,
  getMoneyTo,
  convertMoneyTo,
};