const express = require("express");
const router = express.Router();
const { getMoney, updateMoney } = require("../controllers/moneyController");

router.get("/", getMoney);
router.put("/:id", updateMoney);

module.exports = router;