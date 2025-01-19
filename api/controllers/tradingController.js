const axios  = require('axios');
const pool = require('../../db');
const signRequest = require('../utils/signRequest');
const ADVsignRequest = require('../utils/ADVsignRequest');
const BASE_ADV_URL = 'https://api.coinbase.com/api/v3';
// 'https://api.exchange.coinbase.com';
const API_KEY = process.env.COINBASE_API_KEY;
const PASSPHRASE = process.env.COINBASE_PASSPHRASE;

//RSI Calculations

async function calculateRSI(product_id, period = 14) {
    try {
        const query = `
        SELECT *
        FROM price_history
        WHERE product_id = $1
        ORDER BY id DESC
        LIMIT $2
        `;
        const values = [product_id, period * 2];

        const result = await pool.query(query, values);
        const rows = result.rows;

        const prices = rows.reverse().map(row => parseFloat(row.price));

        if (prices.length < period) {
            throw new Error(`Not enough data to calculate RSI for ${product_id}`);
        }

        //Calculate Gains
        let gains = 0, losses = 0;
        for (let i =1; i < prices.length; i++) {
            const diff = prices[i] - prices [i - 1];
            if (diff >= 0) {
                gains += diff;
            }   else {
                losses += Math.abs(diff);
            }
        }
        const avgGain = gains / period;
        const avgLoss = losses /period;

        //Calculate RSI
        if (avgLoss === 0) {
            return 100;
        }
        const rs = avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);
        return rsi;
    }   catch(error) {
        console.error('Failed to calculate RSI:', error);
        return null;
    }
}

// Place Order

async function placeOrder(side, product_id, size) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const method = 'POST';
    const requestPath = '/brokerage/orders';
    const bodyObj = {
      product_id,
      side,   // "BUY" or "SELL" in advanced trade
      order_configuration: {
        market_market_ioc: {
          base_size: size,
        },
      },
    };

    const bodyJSON = JSON.stringify(bodyObj);
    const signature = ADVsignRequest(timestamp, method, requestPath, bodyJSON);

    const headers = {
      'CB-ACCESS-KEY': process.env.COINBASE_API_KEY,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp.toString(),
      'Content-Type': 'application/json',
    };

    const response = await axios.post(BASE_ADV_URL + requestPath, bodyObj, { headers });
    return response.data;
  } catch (error) {
    console.error('Failed to place order', error.response?.data || error);
    throw error;
  }
}

//Trading Logic

// 3) "No Req/Res" function that can be called by cron or anywhere
async function rsiTradingLogicInternal(product_id) {
    const rsi = await calculateRSI(product_id, 14);
    if (!rsi) {
      throw new Error('Failed to calculate RSI');
    }
  
     console.log(`RSI for ${product_id} = ${rsi}`);
  
    const oversoldThreshold = 30;
    const overboughtThreshold = 70;
  
    let orderResult = null;
  
    // Decide buy/sell
    if (rsi < oversoldThreshold) {
      console.log('RSI indicates oversold, placing BUY order...');
      orderResult = await placeOrder('buy', product_id, '0.001');
      console.log('Buy order result:', orderResult);
    } else if (rsi > overboughtThreshold) {
      console.log('RSI indicates overbought, placing SELL order...');
      orderResult = await placeOrder('sell', product_id, '0.001');
      console.log('Sell order result:', orderResult);
    }
  
    // If an order was placed, store in `orders` table
    if (orderResult) {
      const { id: orderId, status, side, size } = orderResult;
      await pool.query(
        `INSERT INTO orders (product_id, side, order_id, status, size)
         VALUES ($1, $2, $3, $4, $5)`,
        [product_id, side, orderId, status, size]
      );
    }
  
    // Return data for the caller (cron or route)
    return {
      rsi,
      orderResult,
    };
  }
  
  // 4) The Express route version, calls the internal function
  async function rsiTradingLogic(req, res) {
    try {
      const product_id = req.query.product_id || 'BTC-USD';
      const { rsi, orderResult } = await rsiTradingLogicInternal(product_id);
  
      // Respond to the client
      res.json({
        rsi,
        order: orderResult,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error running trading logic' });
    }
  }

module.exports = {
    rsiTradingLogic,
    rsiTradingLogicInternal
};