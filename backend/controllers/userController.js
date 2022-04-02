const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Money = require("../models/moneyModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Some of the fields are missing");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  const money = await Money.create({
    user: user,
    eur: 100,
    usd: 0,
    gbp: 0,
    aud: 0,
    hrk: 0,
  });

  if (user && money) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      eur: money.eur,
      usd: money.usd,
      gbp: money.gbp,
      aud: money.aud,
      hrk: money.hrk,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const money = await Money.findOne({ user: user.id });

    if(!money) {
      res.status(400);
      throw new Error("Money data not found");
    }

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      eur: money.eur,
      usd: money.usd,
      gbp: money.gbp,
      aud: money.aud,
      hrk: money.hrk,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getUserData = asyncHandler(async (req, res) => {
  const money = await Money.findOne({ user: req.user.id });

  if(!money) {
    res.status(400);
    throw new Error("Money data not found");
  }

  res.status(200).json({
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    eur: money.eur,
    usd: money.usd,
    gbp: money.gbp,
    aud: money.aud,
    hrk: money.hrk,
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserData,
};