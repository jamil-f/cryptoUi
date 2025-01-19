const express = require('express');
const router = express.Router();
const { getMarketPrice, getPriceHistory } = require('../controllers/marketController');

router.get('/market-price', getMarketPrice);

router.get('/price-history', getPriceHistory);

module.exports = router;