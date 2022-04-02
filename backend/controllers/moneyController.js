const asyncHandler = require("express-async-handler");
const Money = require("../models/moneyModel");
const axios = require("axios");

const updateMoney = asyncHandler(async (req, res) => {
  const baseCurrencyValueBefore = await getBaseCurrencyValue(req, res);
  const baseCurrencyNewValue = baseCurrencyValueBefore - req.body.amount;
  const targetCurrencyValueBefore = await getTargetCurrencyValue(req, res);
  const targetCurrencyValueAfter = await convertCurrencies(req, res);
  const targetCurrencyNewValue =
    targetCurrencyValueBefore + Number(targetCurrencyValueAfter);

  const baseCurrencyKey = Object.keys(Money.schema.tree).filter(function (key) {
    return key === req.body.base;
  });

  const targetCurrencyKey = Object.keys(Money.schema.tree).filter(function (key) {
    return key === req.body.target;
  });

  const updatedMoney = await Money.updateOne(
    { user: req.user.id },
    {
      $set: {
        [`${baseCurrencyKey}`]: baseCurrencyNewValue,
        [`${targetCurrencyKey}`]: targetCurrencyNewValue,
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

  const baseCurrencyValue = moneyObject[0][req.body.base];

  if (baseCurrencyValue < req.body.amount) {
    res.status(400);
    throw new Error("Not enough money");
  }

  return baseCurrencyValue;
});

const getTargetCurrencyValue = asyncHandler(async (req, res) => {
  const moneyObject = await Money.find({ user: req.user.id });

  if (!moneyObject) {
    res.status(400);
    throw new Error("Money object was not found");
  }

  return moneyObject[0][req.body.target];
});

const convertCurrencies = asyncHandler(async (req, res) => {
  const moneyObject = await Money.find({ user: req.user.id });

  if (!moneyObject) {
    res.status(400);
    throw new Error("Money object was not found");
  }

  const baseCurrencyKey = Object.keys(Money.schema.tree).filter(function (baseKey) {
    return baseKey === req.body.base;
  });

  const targetCurrencyKey = Object.keys(Money.schema.tree).filter(function (targetKey) {
    return targetKey === req.body.target;
  });

  const apiPath = `https://api.getgeoapi.com/v2/currency/convert?api_key=${process.env.CURRENCY_API_KEY}&from=${baseCurrencyKey}&to=${targetCurrencyKey}&amount=${req.body.amount}&format=json`;

  try {
    const response = await axios.get(apiPath);

    return response.data.rates[targetCurrencyKey.toString().toUpperCase()]
      .rate_for_amount;
  } catch (err) {
    res.status(400);
    throw new Error(err);
  }
});

module.exports = {
  updateMoney,
};