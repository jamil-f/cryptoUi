const axios = require('axios');
const signRequest = require('../utils/signRequest');
const pool = require('../../db');
const { propfind } = require('../routes/market');

const BASE_URL = 'https://api.exchange.coinbase.com';
const API_KEY = process.env.COINBASE_API_KEY;
const API_SECRET = process.env.COINBASE_API_SECRET;
const PASSPHRASE = process.env.COINBASE_PASSPHRASE;

async function savePriceToDb(product_id, price, bid, ask) {
  await pool.query(
    `INSERT INTO price_history (product_id, price, bid, ask)
     VALUES ($1, $2, $3, $4)`,
     [product_id, price, bid, ask]
  );
}

async function getPriceHistory(req, res) {
  try {
    const { product_id = 'BTC-USD', limit = 50 } = req.query;

    const query = `
    SELECT *
    FROM price_history
    WHERE product_id = $1
    ORDER BY id DESC
    LIMIT $2
    `;
    const values = [product_id, limit];

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve price history" });
  }
}



async function getMarketPrice(req, res) {
  try {
    const { product_id = 'BTC-USD' } = req.query;
    const timestamp = Math.floor(Date.now() / 1000);
    const method = 'GET';
    const requestPath = `/products/${product_id}/ticker`;

    const signature = signRequest(timestamp, method, requestPath);

    const headers = {
      'CB-ACCESS-KEY': API_KEY,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp.toString(),
      'CB-ACCESS-PASSPHRASE': PASSPHRASE,
      'Content-Type': 'application/json'
    };

     // 1. Fetch price data from Coinbase
     const response = await axios.get(BASE_URL + requestPath, { headers });
     const { price, bid, ask } = response.data;
 
     // 2. Save to PostgreSQL
     await savePriceToDb(product_id, price, bid, ask);
 
     // 3. Respond to the client
     res.json(response.data);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Failed to fetch market price' });
   }
 }

module.exports = { getMarketPrice, getPriceHistory };