const crypto = require ('crypto');
const API_SECRET = process.env.COINBASE_API_SECRET;

module.exports = function signRequest (timestamp, method, requestPath, body = '') {
    const message = timestamp + method + requestPath + body;
    const key = Buffer.from(API_SECRET, 'base64');
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(message);
    return hmac.digest('base64');
};