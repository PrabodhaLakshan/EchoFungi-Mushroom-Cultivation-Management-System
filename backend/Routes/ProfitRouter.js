const express = require("express");
const router = express.Router();
const { generateProfitLoss } = require("../Controlers/ProfitController");

router.post("/generate", generateProfitLoss);

module.exports = router;