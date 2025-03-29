const jwt = require('jsonwebtoken');
const API_KEY_ID = (process.env.COINBASE_ADV_API_KEY || '').replace(/^"|"$/g, '');

function generateJwt(privateKeyPem, uri, nonce) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = {
    sub: API_KEY_ID,
    iss: 'cdp',
    aud: 'https://api.coinbase.com',
    iat: timestamp,
    exp: timestamp + 120,
    uri, // Include the URI claim as required by the documentation example
  };

  return jwt.sign(payload, privateKeyPem, {
    algorithm: 'ES256',
    header: {
      kid: API_KEY_ID,
      typ: 'JWT',
      nonce, // Using the nonce passed from the controller
    },
  });
}

module.exports = generateJwt;