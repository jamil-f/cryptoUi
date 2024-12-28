const express = require('express');
const router = express.Router();
const { getMarketPrice } = require('../controllers/marketController');

router.get('/market-price', getMarketPrice);

module.exports = router;