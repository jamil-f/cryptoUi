const crypto = require ('crypto');
const API_SECRET = process.env.COINBASE_API_SECRET;

module.exports = function ADVsignRequest (timestamp, method, requestPath, body = '') {
    const message = timestamp + method + requestPath + body;
    const key = Buffer.from(API_SECRET, 'base64');
    return crypto
      .createHmac('sha256', key)
      .update(message)
      .digest('base64');
  };