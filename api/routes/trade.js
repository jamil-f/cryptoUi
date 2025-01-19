const express = require('express');
const router = express.Router();
const { rsiTradingLogic } = require('../controllers/tradingController')

router.get('/rsi-trade', rsiTradingLogic);

module.exports = router;