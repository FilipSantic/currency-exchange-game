const asyncHandler = require("express-async-handler");
const Money = require("../models/moneyModel");
const axios = require("axios");

const updateMoney = asyncHandler(async (req, res) => {
  const baseCurrencyValue = await getBaseCurrencyValue(req, res);
  const targetCurrencyValueBefore = await getTargetCurrencyValue(req, res);
  const targetCurrencyNewValue = await convertCurrencies(req, res);
  const targetCurrencyValueAfter =
    targetCurrencyValueBefore + Number(targetCurrencyNewValue);

  const baseCurrencyKey = Object.keys(Money.schema.tree).filter(function (key) {
    return key === req.body.from;
  });

  const targetCurrencyKey = Object.keys(Money.schema.tree).filter(function (
    key
  ) {
    return key === req.body.to;
  });

  const updatedMoney = await Money.updateOne(
    { user: req.user.id },
    {
      $set: {
        [`${baseCurrencyKey}`]: baseCurrencyValue,
        [`${targetCurrencyKey}`]: targetCurrencyValueAfter,
      },
    }
  );

  if (!updatedMoney) {
    res.status(400);
    throw new Error("Money was not updated");
  }
});

const getBaseCurrencyValue = asyncHandler(async (req, res) => {
  const moneyObject = await Money.find({ user: req.user.id });

  if (!moneyObject) {
    res.status(400);
    throw new Error("Money object was not found");
  }

  const baseCurrencyValue = moneyObject[0][req.body.from];

  if (baseCurrencyValue < req.body.amount) {
    res.status(400);
    throw new Error("Not enough money");
  }

  return baseCurrencyValue - req.body.amount;
});

const getTargetCurrencyValue = asyncHandler(async (req, res) => {
  const moneyObject = await Money.find({ user: req.user.id });

  if (!moneyObject) {
    res.status(400);
    throw new Error("Money object was not found");
  }

  return moneyObject[0][req.body.to];
});

const convertCurrencies = asyncHandler(async (req, res) => {
  const moneyObject = await Money.find({ user: req.user.id });

  if (!moneyObject) {
    res.status(400);
    throw new Error("Money object was not found");
  }

  const targetCurrencyKey = Object.keys(Money.schema.tree).filter(function (
    toKey
  ) {
    return toKey === req.body.to;
  });

  const baseCurrencyKey = Object.keys(Money.schema.tree).filter(function (
    fromKey
  ) {
    return fromKey === req.body.from;
  });

  const apiPath = `https://api.getgeoapi.com/v2/currency/convert?api_key=${process.env.CURRENCY_API_KEY}&from=${baseCurrencyKey}&to=${targetCurrencyKey}&amount=${req.body.amount}&format=json`;

  try {
    const response = await axios.get(apiPath);

    return response.data.rates[targetCurrencyKey.toString().toUpperCase()]
      .rate_for_amount;
  } catch (err) {
    res.status(400);
    throw new Error("Connection to currency data server failed");
  }
});

module.exports = {
  updateMoney,
};