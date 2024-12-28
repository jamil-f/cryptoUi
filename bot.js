require ('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

const API_KEY = process.env.COINBASE_API_KEY;
const API_SECRET = process.env.COINBASE_API_SECRET;
// const PASSPHRASE = process.env.COINBASE_PASSPHRASE;


const BASE_URL =  'https://api.exchange.coinbase.com';

function signRequest (timestamp, method, requestPath, body = '') {
    const message = timestamp + method + requestPath + body;
    const key = Buffer.from(API_SECRET, 'base64');
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(message);
    return hmac.digest('base64');
}

async function getMarketPrice (product_id = 'BTC-USD') {
    const timestamp = Math.floor(Date.now() / 1000);
    const method = 'GET';
    
    const requestPath = `/products/${product_id}/ticker`;

    const signature = signRequest(timestamp, method, requestPath);

    const headers = {
        'CB-ACCESS-KEY': API_KEY,
        'CB-ACCESS-SIGN': signature,
        'CB-ACCEES-TIMESTAMP': timestamp.toString(),
        'Content-Type': 'application/json'
    };

    const response = await axios.get(BASE_URL + requestPath, { headers });
    return response.data;
}

getMarketPrice()
.then(data => console.log(data))
.catch(err => console.error(err));
